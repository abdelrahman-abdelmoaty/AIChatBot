"use server";

import { createUser } from "@/server/user";
import { signOut as signOutAuth } from "@/app/(app)/(auth)/auth";

export async function signUp({ name, email, password }: { name: string; email: string; password: string }) {
  const { user, error } = await createUser({ name, email, password });

  if (error) {
    return { error };
  }

  return { user };
}

export async function signOut() {
  await signOutAuth({ redirectTo: "/" });
}
