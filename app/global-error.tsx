"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body>
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-lg text-muted-foreground mb-6">{error.message || "An unexpected error occurred"}</p>
          <a href="/" className="text-primary hover:underline">
            Return Home
          </a>
        </div>
      </body>
    </html>
  );
}
