"use server";

import { updateUser } from "@/server/user";

export async function updateSettings({
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
}) {
  const { user, error } = await updateUser({ name, email, password, confirmPassword, currentPassword });

  if (error) {
    return { error: error };
  }

  return { user: user, success: "Settings updated successfully" };
}
