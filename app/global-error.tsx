"use client";

import Link from "next/link";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body>
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-lg text-muted-foreground mb-6">{error.message || "An unexpected error occurred"}</p>
          <Link href="/" className="text-primary hover:underline">
            Return Home
          </Link>
        </div>
      </body>
    </html>
  );
}
