import { Metadata } from "next";

import { SignUpForm } from "@/app/(app)/(auth)/sign-up/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default async function SignUpPage() {
  return (
    <div className="h-full flex items-center justify-center pb-48">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
