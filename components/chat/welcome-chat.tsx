"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_PROMPTS = [
  "Tell me about the latest developments in AI",
  "Help me write a professional email",
  "Explain quantum computing in simple terms",
  "Give me some creative writing prompts",
];

export function WelcomeChat({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) {
  return (
    <div className="flex items-center justify-center h-full text-center p-8">
      <div className="max-w-md space-y-6">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="text-lg font-medium">Start a new conversation</h3>
        <p className="text-muted-foreground mb-4">Choose a prompt or type your own message to get started:</p>
        <div className="grid grid-cols-1 gap-3">
          {DEFAULT_PROMPTS.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-left h-auto py-3 justify-start"
              onClick={() => onPromptSelect(prompt)}
            >
              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
