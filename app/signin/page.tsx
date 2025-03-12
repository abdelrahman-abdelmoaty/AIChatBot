import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/chat");
  }

  return (
    <div className="h-full flex items-center justify-center pb-48">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <SignInForm />
      </div>
    </div>
  );
}
