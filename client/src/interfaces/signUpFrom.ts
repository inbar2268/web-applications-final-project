import z from 'zod';

export const schema = z.object({
    username: z.string().nonempty('Username is required').max(32, 'Username must be less than 32 characters'),
    email: z.string().nonempty('Email is required').email('Email is invalid'),
    password: z.string().nonempty('Password is required').min(6, 'Password must at least 6 characters'),
  });
  
export type IFormData = z.infer<typeof schema>;
  