import { z } from 'zod';

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Group schemas
export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(50, 'Group name too long'),
  description: z.string().max(200, 'Description too long').optional(),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().min(6, 'Invite code must be 6 characters').max(6, 'Invite code must be 6 characters'),
});

// Product schemas
export const productCategorySchema = z.enum(['Kitchen', 'Bathroom', 'Groceries']);

export const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(50, 'Product name too long'),
  category: productCategorySchema,
  quantityPercent: z.number().min(0).max(100),
  status: z.enum(['inStock', 'low', 'out', 'needed']),
});

export const editProductSchema = addProductSchema.extend({
  status: z.enum(['inStock', 'low', 'out', 'needed']),
});

// Types inferred from schemas
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type JoinGroupFormData = z.infer<typeof joinGroupSchema>;
export type AddProductFormData = z.infer<typeof addProductSchema>;
export type EditProductFormData = z.infer<typeof editProductSchema>;