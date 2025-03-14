import { Metadata } from "next";

import { SignInForm } from "@/app/(app)/(auth)/sign-in/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  return (
    <div className="h-full flex items-center justify-center pb-48">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <SignInForm />
      </div>
    </div>
  );
}
