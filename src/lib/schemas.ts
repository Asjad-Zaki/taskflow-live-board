
import { z } from 'zod';

// User/Profile schemas
export const appRoleSchema = z.enum(['admin', 'project_manager', 'developer', 'tester', 'viewer']);

export const profileSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: appRoleSchema,
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

// Task schemas
export const taskStatusSchema = z.enum(['todo', 'progress', 'review', 'done']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignee_id: z.string().uuid().nullable().optional(),
  assignee_name: z.string().nullable().optional(),
  assignee_avatar: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  labels: z.array(z.string()).nullable().optional(),
  comments_count: z.number().nullable().optional(),
  attachments_count: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  created_by: z.string().uuid().optional(),
});

// Project schemas
export const projectStatusSchema = z.enum(['active', 'planning', 'onhold', 'completed']);
export const projectPrioritySchema = z.enum(['low', 'medium', 'high']);

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  status: projectStatusSchema,
  priority: projectPrioritySchema,
  owner_id: z.string().uuid(),
  owner_name: z.string(),
  owner_avatar: z.string(),
  team_members: z.array(z.string()),
  due_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Notification schemas
export const notificationTypeSchema = z.enum(['task_completed', 'comment', 'user_added', 'deadline']);

export const notificationSchema = z.object({
  id: z.string().uuid(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
  created_at: z.string(),
  user_id: z.string().uuid(),
  related_task_id: z.string().uuid().nullable().optional(),
});

// Form validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: appRoleSchema,
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: appRoleSchema,
});

// Project form schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  status: projectStatusSchema,
  priority: projectPrioritySchema,
  due_date: z.string().min(1, 'Due date is required'),
});

export const updateProjectSchema = createProjectSchema.partial();

// Landing page schemas
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const demoRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company name is required'),
  teamSize: z.enum(['1-10', '11-50', '51-200', '200+']),
  useCase: z.string().min(10, 'Please describe your use case'),
});

// Search and filter schemas
export const taskFilterSchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignee_id: z.string().uuid().optional(),
  search: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export const projectFilterSchema = z.object({
  status: projectStatusSchema.optional(),
  priority: projectPrioritySchema.optional(),
  owner_id: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const userFilterSchema = z.object({
  role: appRoleSchema.optional(),
  search: z.string().optional(),
});

// Settings schemas
export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  avatar_url: z.string().url().optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
 
// Export types
export type Profile = z.infer<typeof profileSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type AppRole = z.infer<typeof appRoleSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
