// Zod validation schemas for forms and API endpoints

import { z } from 'zod';

// User schemas
export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
});

export const profileUpdateSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number').optional(),
});

// Address schema
export const addressSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
    addressLine: z.string().min(10, 'Please enter a complete address'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),
    isDefault: z.boolean().optional(),
});

// Product schemas
export const productSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be greater than 0'),
    categoryId: z.string().min(1, 'Category is required'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    variants: z.array(z.object({
        type: z.string(),
        options: z.array(z.string()),
    })).optional(),
    featured: z.boolean().optional(),
});

export const productFilterSchema = z.object({
    category: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    search: z.string().optional(),
    sort: z.enum(['price-asc', 'price-desc', 'newest', 'popular']).optional(),
    page: z.number().positive().optional(),
    limit: z.number().positive().optional(),
});

// Category schema
export const categorySchema = z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug is required'),
    description: z.string().optional(),
    image: z.string().url().optional(),
});

// Order schema
export const checkoutSchema = z.object({
    addressId: z.string().min(1, 'Shipping address is required'),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        variant: z.string().optional(),
    })).min(1, 'Cart cannot be empty'),
});

export const orderStatusUpdateSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});

// Contact form schema
export const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number').optional(),
    subject: z.string().min(3, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
