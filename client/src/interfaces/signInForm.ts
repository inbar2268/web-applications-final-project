import z from 'zod';

export const schema = z.object({
  username: z.string().nonempty('Please enter a username'),
  password: z.string().nonempty('Please enter a password')
});

export type IFormData = z.infer<typeof schema>;