import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const createLoginSchema = (t: TranslationFunction) => 
  z.object({
    username: z
      .string()
      .min(1, t('validation.required'))
      .email(t('validation.emailInvalid'))
      .max(100, 'Email must not exceed 100 characters'),
    password: z
      .string()
      .min(1, t('validation.required'))
      .min(6, t('validation.passwordTooShort'))
      .max(100, 'Password must not exceed 100 characters'),
  });

export const createRegisterSchema = (t: TranslationFunction) =>
  z
    .object({
      username: z
        .string()
        .min(1, t('validation.usernameRequired'))
        .min(3, t('validation.usernameTooShort'))
        .max(50, 'Username must not exceed 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
      email: z
        .string()
        .min(1, t('validation.required'))
        .email(t('validation.emailInvalid'))
        .max(100, 'Email must not exceed 100 characters'),
      password: z
        .string()
        .min(1, t('validation.required'))
        .min(6, t('validation.passwordTooShort'))
        .max(100, 'Password must not exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
      confirmPassword: z
        .string()
        .min(1, t('validation.required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsMustMatch'),
      path: ['confirmPassword'],
    });

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(100, 'Email must not exceed 100 characters'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data);
};

export const validateRegister = (data: unknown) => {
  return registerSchema.safeParse(data);
}; 