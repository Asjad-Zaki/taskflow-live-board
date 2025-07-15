 
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useCreateTask } from "@/hooks/queries/useTasks";
import { createTaskSchema, type CreateTaskInput } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddTaskDialogProps {
  status?: CreateTaskInput['status'];
  trigger?: React.ReactNode;
}

const AddTaskDialog = ({ status = 'todo', trigger }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const createTaskMutation = useCreateTask();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: status,
      priority: 'medium',
      labels: [],
    },
  });

  const availableLabels = [
    'backend', 'frontend', 'design', 'testing', 'api', 'ui', 'security', 
    'qa', 'setup', 'devops', 'realtime', 'mobile'
  ];

  const handleSubmit = async (data: CreateTaskInput) => {
    const taskData = {
      ...data,
      labels: selectedLabels
    };

    createTaskMutation.mutate(taskData, {
      onSuccess: () => {
        form.reset();
        setSelectedLabels([]);
        setOpen(false);
      }
    });
  };

  const addLabel = (label: string) => {
    if (!selectedLabels.includes(label)) {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const removeLabel = (label: string) => {
    setSelectedLabels(selectedLabels.filter(l => l !== label));
  };

  const addNewLabel = () => {
    if (newLabel.trim() && !selectedLabels.includes(newLabel.trim())) {
      setSelectedLabels([...selectedLabels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="text-gray-500 text-sm w-full">
            + Add a task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Task description (optional)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="urgent">Urgent Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedLabels.map((label) => (
                  <Badge key={label} variant="secondary" className="flex items-center gap-1">
                    {label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeLabel(label)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add custom label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewLabel())}
                />
                <Button type="button" onClick={addNewLabel} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {availableLabels
                  .filter(label => !selectedLabels.includes(label))
                  .map((label) => (
                    <Button
                      key={label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLabel(label)}
                      className="h-6 text-xs"
                    >
                      {label}
                    </Button>
                  ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
