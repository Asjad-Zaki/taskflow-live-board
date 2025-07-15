
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { profileSchema, signInSchema, signUpSchema, type Profile, type SignInInput, type SignUpInput } from '@/lib/schemas';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const AUTH_QUERY_KEY = ['auth'] as const;
const PROFILE_QUERY_KEY = ['profile'] as const;

// Get current user profile with better error handling
export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: [...PROFILE_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return null;

      console.log('Fetching profile for user:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        if (error.code === 'PGRST116') {
          console.log('Profile not found, this might be a new user');
          return null; // Profile not found
        }
        throw error;
      }
      
      console.log('Profile fetched successfully:', data);
      return profileSchema.parse(data);
    },
    enabled: !!userId,
    retry: 2, // Retry failed requests 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// Sign in mutation
export const useSignIn = () => {
  return useMutation({
    mutationFn: async (credentials: SignInInput) => {
      const validatedCredentials = signInSchema.parse(credentials);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedCredentials.email,
        password: validatedCredentials.password
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Sign In Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    },
  });
};

// Sign up mutation
export const useSignUp = () => {
  return useMutation({
    mutationFn: async (userData: SignUpInput) => {
      const validatedData = signUpSchema.parse(userData);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
            role: validatedData.role
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Account Created!',
        description: 'Please check your email to verify your account.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Sign Up Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });
};

// Sign out mutation
export const useSignOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== 'Session not found') {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Sign Out Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      
      return profileSchema.parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...PROFILE_QUERY_KEY, data.id] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });
};
