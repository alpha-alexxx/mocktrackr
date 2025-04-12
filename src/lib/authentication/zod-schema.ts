import { z } from 'zod';

export const getNameValidation = (fieldName = 'Name') =>
    z
        .string({
            required_error: `${fieldName} is required`,
            invalid_type_error: `${fieldName} must be a string`
        })
        .min(2, { message: `${fieldName} must be at least 2 characters` })
        .max(50, { message: `${fieldName} must not exceed 50 characters` })
        .regex(/^[A-Za-z\s]+$/, {
            message: `${fieldName} can only contain letters and spaces`
        });

/**
 * Email validation
 */
export const getEmailValidation = () =>
    z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string'
        })
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email address' });

/**
 * Password validation
 */
export const getPasswordValidation = () =>
    z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string'
        })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(64, { message: 'Password must not exceed 64 characters' })
        .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must include at least one number' })
        .regex(/[@$!%*?&#]/, { message: 'Password must include at least one special character (@$!%*?&#)' });

/**
 * Confirm password validation (depends on parent object)
 */
export const getConfirmPasswordValidation = () => z.string({ required_error: 'Confirm Password is required' });
/**
 * Accept Terms validation that allows `boolean` and checks if true
 */
export const getAcceptTermsValidation = () =>
    z
        .boolean({
            required_error: 'You must accept the terms and conditions',
            invalid_type_error: 'Invalid selection'
        })
        .refine((val) => val === true, {
            message: 'You must accept the terms and conditions'
        });

// Login schema
export const loginSchema = z.object({
    email: getEmailValidation(),
    password: getPasswordValidation(),
    rememberMe: z.boolean().optional()
});

// Register schema
export const registerSchema = z
    .object({
        name: getNameValidation('Full Name'),
        email: getEmailValidation(),
        password: getPasswordValidation(),
        confirmPassword: getConfirmPasswordValidation(),
        acceptTerms: getAcceptTermsValidation()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: getEmailValidation()
});

// Reset password schema
export const resetPasswordSchema = z
    .object({
        password: getPasswordValidation(),
        confirmPassword: getConfirmPasswordValidation()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });
