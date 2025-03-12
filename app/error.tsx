"use client";

import { useEffect } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Error",
  description: "Something went wrong.",
};

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-lg text-muted-foreground mb-6">{error.message || "An unexpected error occurred"}</p>
      <div className="flex gap-4">
        <button onClick={reset} className="text-primary hover:underline">
          Try again
        </button>
        <Link href="/" className="text-primary hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
