import { z } from 'zod';

export const loginSchema = z.object({
  employeeId: z.string().min(3, 'Employee ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  employeeId: z.string().min(3, 'Employee ID must be at least 3 characters'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  registrationCode: z.string().min(4, 'Registration code is required'),
  department: z.string().min(2, 'Department is required'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
});

export const equipmentSchema = z.object({
  equipmentId: z.string().min(2, 'Equipment ID is required'),
  name: z.string().min(2, 'Equipment name is required'),
  description: z.string().min(5, 'Description is required'),
  totalQuantity: z.number().min(1, 'Total quantity must be at least 1'),
  category: z.string().min(2, 'Category is required'),
  location: z.string().min(2, 'Location is required'),
  condition: z.enum(['good', 'fair', 'damaged']),
});

export const checkoutSchema = z.object({
  equipmentId: z.string().min(2, 'Equipment ID is required'),
  quantityCheckout: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});

export const returnSchema = z.object({
  checkoutId: z.string().min(2, 'Checkout ID is required'),
  returnCondition: z.enum(['good', 'fair', 'damaged']),
  notes: z.string().optional(),
});

export const generateCodeSchema = z.object({
  expiresInDays: z.number().min(1, 'Expiration days must be at least 1').default(30),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EquipmentInput = z.infer<typeof equipmentSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReturnInput = z.infer<typeof returnSchema>;
export type GenerateCodeInput = z.infer<typeof generateCodeSchema>;
