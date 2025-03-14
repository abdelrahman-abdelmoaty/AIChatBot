"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function SupportForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      };

      // Here you would typically send the data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call

      toast.success("Message sent successfully!");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Contact Support</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input name="name" placeholder="Your name" required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Input name="email" type="email" placeholder="Your email" required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Textarea name="message" placeholder="How can we help?" required disabled={isLoading} />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
