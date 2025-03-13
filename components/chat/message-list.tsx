"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { LoadingIndicator } from "./loading-indicator";
import { Message, type UIMessage } from "ai";

export function MessageList({ messages, isLoading }: { messages: UIMessage[]; isLoading: boolean }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-180px)] overflow-auto py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
