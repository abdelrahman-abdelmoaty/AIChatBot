import "server-only";

import { z } from "zod";
import { compare, hash } from "bcrypt-ts";

import { prisma } from "@/lib/db";
import { auth } from "@/app/(auth)/auth";

const emailSchema = z
  .string({ required_error: "Email is required" })
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email format" });

export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = emailSchema.safeParse(email);

    if (error) {
      return { error: error.message };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { user: { id: user.id, name: user.name, email: user.email, password: user.password } };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { error: "Failed to fetch user" };
  }
};

const idSchema = z.string().min(1, "ID is required");
export const getUserById = async (id: string) => {
  try {
    const { data, error } = idSchema.safeParse(id);

    if (error) {
      return { error: error.message };
    }

    const user = await prisma.user.findUnique({
      where: { id: data },
      include: { subscription: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { user: { id: user.id, name: user.name, email: user.email, subscription: user.subscription } };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { error: "Failed to fetch user" };
  }
};

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createUser = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  try {
    const { data, error } = userSchema.safeParse({ name, email, password });

    if (error) {
      return { error: error.message };
    }

    const hashedPassword = await hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { user: newUser };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { error: "Failed to create user" };
  }
};

const updateUserSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }).min(1, "Name is required"),
    email: z.string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email address"),
    currentPassword: z.string().optional(),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(1, "Confirm password is required")
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const updateUser = async ({
  name,
  email,
  password,
  confirmPassword,
  currentPassword,
}: {
  name: string;
  email: string;
  password: string | undefined;
  confirmPassword: string | undefined;
  currentPassword: string | undefined;
}) => {
  try {
    const { data, error } = updateUserSchema.safeParse({ name, email, password, confirmPassword, currentPassword });

    if (error) {
      return { error: error.message };
    }

    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    if (data.password) {
      if (!data.currentPassword) {
        return { error: "Current password is required" };
      }
      const isPasswordCorrect = await compare(data.currentPassword, existingUser.password);
      if (!isPasswordCorrect) {
        return { error: "Current password is incorrect" };
      }
    }

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userWithSameEmail) {
      return { error: "This email is already in use" };
    }

    const hashedPassword = data.password ? await hash(data.password, 10) : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { user: updatedUser };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
};
