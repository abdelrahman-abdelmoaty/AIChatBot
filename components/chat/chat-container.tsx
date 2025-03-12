"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Loader2, Send, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { log } from "console";
import { saveChat } from "@/actions/save-chat";

const DEFAULT_PROMPTS = [
  "Tell me about the latest developments in AI",
  "Help me write a professional email",
  "Explain quantum computing in simple terms",
  "Give me some creative writing prompts",
];

export function ChatContainer({
  initialConversations,
  conversationSlug,
}: {
  initialConversations: Conversation[];
  conversationSlug: string | null;
}) {
  const [chatHistories, setChatHistories] = useState<Conversation[]>(initialConversations);
  const [currentChatId, setCurrentChatId] = useState<string | null>(conversationSlug);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { messages, input, handleInputChange, handleSubmit, status, setMessages, setInput } = useChat({
    api: "/api/chat",
    initialMessages:
      initialConversations
        .find((conversation) => conversation.id === conversationSlug)
        ?.messages.map((message) => ({
          id: message.id,
          role: message.role as "system" | "user" | "assistant" | "data",
          content: message.content,
        })) || [],
    body: {
      conversationId: currentChatId,
    },
    onResponse: (response) => {
      const responseConversationId = response.headers.get("x-conversation-id");
      if (responseConversationId && !currentChatId) {
        setCurrentChatId(responseConversationId);

        window.history.pushState({}, "", `/chat/${responseConversationId}`);
        // Use the input text as the chat name
        const chatName = input || "New Chat";

        const newChat: Conversation = {
          id: responseConversationId,
          name: chatName,
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            conversationId: responseConversationId,
            createdAt: new Date(),
            userId: "",
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "",
        };
        setChatHistories((prev) => [newChat, ...prev]);
      } else if (currentChatId) {
        setChatHistories((prev) =>
          prev.map((chat) => {
            if (chat.id === currentChatId) {
              return {
                ...chat,
                updatedAt: new Date(),
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

    onError: (error) => {
      toast.error(JSON.parse(error.message).error);
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleChatSelect = (chatId: string) => {
    if (chatId === currentChatId) return;

    setCurrentChatId(chatId);
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setMessages(
        selectedChat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role as "system" | "user" | "assistant" | "data",
          content: msg.content,
        }))
      );
      window.history.pushState({}, "", `/chat/${chatId}`);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    handleSubmit();
  };

  // Format timestamp for display - simplified for sidebar
  const formatTimestamp = (date: Date) => {
    try {
      return format(new Date(date), "MMM d, h:mm a");
    } catch (e) {
      return "Recent"; // Fallback if date is invalid
    }
  };

  // Generate chat preview text
  const getChatPreview = (chat: Conversation) => {
    // Find the last user or assistant message
    const lastMessage = [...chat.messages].reverse().find((msg) => msg?.role === "user" || msg?.role === "assistant");

    if (!lastMessage?.content) return "New conversation";

    // Create a clean preview - truncate at 30 chars
    return lastMessage.content.slice(0, 30) + (lastMessage.content.length > 30 ? "..." : "");
  };

  // Generate a unique chat name based on first user message
  const getChatName = (chat: Conversation) => {
    return chat.name || "New Chat";
  };

  // Deduplicate chats by content if needed
  const uniqueChats = chatHistories.filter((chat, index, self) => index === self.findIndex((c) => c.id === chat.id));

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r bg-muted/20 p-4 flex flex-col">
        <Button
          onClick={handleNewChat}
          className="w-full mb-4 gap-2 shadow-sm hover:shadow-md transition-all"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>

        <div className="mb-2 text-sm font-medium text-muted-foreground px-2">
          {uniqueChats.length > 0 ? "Your conversations" : "No conversations yet"}
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {uniqueChats.map((chat) => (
              <Button
                key={chat.id}
                variant={currentChatId === chat.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full py-3 px-3 h-auto items-start justify-start whitespace-normal",
                  "flex flex-col gap-1 text-left",
                  currentChatId === chat.id ? "bg-secondary/80 shadow-sm" : "hover:bg-secondary/40"
                )}
                onClick={() => handleChatSelect(chat.id)}
              >
                <div className="flex">
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 opacity-70" />
                  <div className="font-medium line-clamp-2 -mt-1">{getChatName(chat)}</div>
                </div>
                <div className="text-xs text-muted-foreground w-full text-right">
                  {formatTimestamp(chat.updatedAt || chat.createdAt)}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Card className="flex-1 flex flex-col border-0 rounded-none shadow-none bg-background">
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            {messages.length === 0 ? (
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
                        onClick={() => handlePromptSelect(prompt)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ScrollArea ref={scrollAreaRef} className="h-full py-6 px-4">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-4 text-sm animate-in fade-in",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
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
                        <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-secondary prose-pre:rounded-md max-w-none">
                          {message.content}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {(status === "streaming" || status === "submitted") && (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-4 rounded-lg shadow-sm flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="p-4 bg-background">
            <form ref={formRef} onSubmit={handleSubmit} className="flex w-full items-end gap-2 max-w-3xl mx-auto">
              <div className="relative w-full max-w-3xl">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="min-h-[60px] pr-12 resize-none focus-visible:ring-1 focus-visible:ring-offset-0 border-muted"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim()) {
                        handleSubmit(e as any);
                      }
                    }
                  }}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={status === "streaming" || status === "submitted" || !input.trim()}
                        className="absolute bottom-2 right-2 h-8 w-8"
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send message (Enter)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ChatContainer;
