import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters and spaces")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters and spaces")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  agreeToTermsAndCondition: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Privacy Policy",
  }),
});

export type RegisterFormType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type LoginFormType = z.infer<typeof loginSchema>;

export const createNewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type CreatePasswordFormType = z.infer<typeof createNewPasswordSchema>;

export const paymentMethodSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d{13,19}$/, "Please enter a valid card number (13-19 digits)")
    .transform((val) => val.replace(/\s/g, ""))
    .refine(
      (val) => {
        // Luhn algorithm validation
        let sum = 0;
        let isEven = false;
        for (let i = val.length - 1; i >= 0; i--) {
          let digit = parseInt(val[i]);
          if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          isEven = !isEven;
        }
        return sum % 10 === 0;
      },
      { message: "Invalid card number" }
    ),

  cardholderName: z
    .string()
    .min(1, "Cardholder name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .trim(),

  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Please enter a valid expiry date (MM/YY)"
    )
    .refine(
      (val) => {
        const [month, year] = val.split("/");
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        return expiry > now;
      },
      { message: "Card has expired" }
    ),

  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .length(3, "CVV must be 3 digits")
    .or(z.string().length(4, "CVV must be 4 digits")),
});

export type PaymentMethodFormType = z.infer<typeof paymentMethodSchema>;
