"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Loader2, Send, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation, Message } from "@/lib/types";

export function ChatContainer({ initialChats }: { initialChats: Conversation[] }) {
  const [chatHistories, setChatHistories] = useState<Conversation[]>(initialChats);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/chat",
    body: {
      conversationId: currentChatId,
    },
    onResponse: (response) => {
      const responseData = response.headers.get("x-conversation-id");
      if (responseData && !currentChatId) {
        setCurrentChatId(responseData);
        // Create new chat history
        const newChat: Conversation = {
          id: responseData,
          name: messages[0].content.slice(0, 100),
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            conversationId: responseData,
            createdAt: new Date(),
            userId: "",
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "",
        };
        setChatHistories((prev) => [...prev, newChat]);
      } else if (currentChatId) {
        // Update existing chat history
        setChatHistories((prev) =>
          prev.map((chat) => {
            if (chat.id === currentChatId) {
              return {
                ...chat,
                messages: messages.map((msg) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                  conversationId: currentChatId,
                  createdAt: new Date(),
                  userId: chat.userId,
                })),
              };
            }
            return chat;
          })
        );
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
      textareaRef.current.style.maxHeight = "200px";
    }
  }, [input]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const chat = chatHistories.find((c) => c.id === chatId);
    if (chat) {
      setMessages(
        chat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        }))
      );
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistories((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const exampleQuestions = [
    "What is machine learning?",
    "Can you explain how blockchain works?",
    "How can I improve my productivity?",
    "Write a short poem about technology",
  ];

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleNewChat}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="w-64 flex flex-col gap-2">
          <Button onClick={handleNewChat} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <ScrollArea className="flex-1">
            {chatHistories.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted",
                  currentChatId === chat.id && "bg-muted"
                )}
                onClick={() => handleSelectChat(chat.id)}
              >
                <span className="truncate">{chat.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>

        <Card className="flex flex-1 flex-col">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-base font-medium">
              {currentChatId ? chatHistories.find((c) => c.id === currentChatId)?.name || "Conversation" : "New Chat"}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-6 text-center p-8">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10 text-primary"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-xl font-semibold">Start a conversation</h3>
                    <p className="text-muted-foreground text-sm">Ask any question or try one of these examples:</p>
                  </div>
                  <div className="grid gap-2 w-full max-w-sm">
                    {exampleQuestions.map((question) => (
                      <Button
                        key={question}
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          handleInputChange({ target: { value: question } } as any);
                          if (textareaRef.current) {
                            textareaRef.current.focus();
                          }
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-3 text-sm",
                        message.role === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className={cn("h-8 w-8", message.role === "user" ? "ml-2" : "mr-2")}>
                        {message.role === "user" ? (
                          <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
                        ) : (
                          <>
                            <AvatarImage src="/images/bot-avatar.png" alt="AI" />
                            <AvatarFallback className="bg-muted">AI</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={cn(
                          "rounded-lg px-4 py-2 max-w-[80%]",
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                      >
                        <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-muted prose-pre:rounded-md max-w-none whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <Separator />

          <CardFooter className="p-4">
            <form onSubmit={handleSubmit} className="flex w-full items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="min-h-[60px] flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (form && input.trim()) {
                      form.dispatchEvent(new Event("submit", { cancelable: true }));
                    }
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-10 w-10">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            {error && (
              <p className="mt-2 text-sm text-destructive">
                {error.message || "Something went wrong. Please try again."}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ChatContainer;
