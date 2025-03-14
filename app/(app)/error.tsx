"use client";

import { useEffect } from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="pb-48">
        <Card className="max-w-[400px] p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold text-primary">Error</CardTitle>
            <CardDescription className="text-lg mt-2">Something went wrong!</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            {error.message || "An unexpected error occurred"}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="default" onClick={reset}>
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/chat">Start a new chat</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
