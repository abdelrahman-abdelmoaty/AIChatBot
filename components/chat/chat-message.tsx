"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from "./markdown";
import { type UIMessage } from "ai";

export function ChatMessage({ message }: { message: UIMessage }) {
  return (
    <div
      className={cn("flex gap-4 text-sm animate-in fade-in", message.role === "user" ? "justify-end" : "justify-start")}
    >
      {message.role !== "user" && (
        <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[85%]",
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted shadow-sm"
        )}
      >
        <Markdown>{message.content}</Markdown>
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
