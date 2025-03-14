import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="pb-48">
        <Card className="max-w-[400px] p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
            <CardDescription className="text-lg mt-2">Oops! Page not found</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="default" asChild>
              <a href="/">Return Home</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/chat">Start a new chat</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
