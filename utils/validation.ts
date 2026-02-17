import * as z from "zod";

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password1: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      ),
    password2: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
  });

  export const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain uppercase, lowercase, and number",
        ),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
  });
  export const checkoutSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[+\d][\d\s\-()]+$/, "Invalid phone number"),
    country: z.string().min(1, "Country is required"),
    full_address: z.string().min(1, "Full address is required"),
    order_notes: z.string().optional(),
  });