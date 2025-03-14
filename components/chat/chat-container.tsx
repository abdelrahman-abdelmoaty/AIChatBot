"use client";

import { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Conversation, Message, Role } from "@/lib/types";

import { ChatSidebar } from "./chat-sidebar";
import { WelcomeChat } from "./welcome-chat";
import { MessageList } from "./message-list";
import { ChatInputForm } from "./chat-input-form";

export function ChatContainer({
  initialConversations,
  conversationSlug,
}: {
  initialConversations: Conversation[];
  conversationSlug: string | null;
}) {
  const [chatHistories, setChatHistories] = useState<Conversation[]>(initialConversations);
  const [currentChatId, setCurrentChatId] = useState<string | null>(conversationSlug);

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status, setMessages, setInput } = useChat({
    api: "/api/chat",
    initialMessages:
      initialConversations
        .find((conversation) => conversation.id === conversationSlug)
        ?.messages.map((message) => ({
          id: message.id,
          role: message.role as Role,
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

        const newMessages: Message[] = messages.map((message) => ({
          id: message.id,
          role: message.role as Role,
          content: message.content,
          conversationId: responseConversationId,
          createdAt: new Date(),
          userId: "",
        }));

        const newChat: Conversation = {
          id: responseConversationId,
          name: chatName,
          messages: newMessages,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "",
        };
        setChatHistories((prev) => [newChat, ...prev]);
      } else if (currentChatId) {
        setChatHistories((prev) =>
          prev.map((chat) => {
            if (chat.id === currentChatId) {
              const updatedMessages: Message[] = messages.map((msg) => ({
                id: msg.id,
                role: msg.role as Role,
                content: msg.content,
                conversationId: currentChatId,
                createdAt: new Date(),
                userId: chat.userId,
              }));

              return {
                ...chat,
                updatedAt: new Date(),
                messages: updatedMessages,
              };
            }
            return chat;
          })
        );
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(JSON.parse(error.message).error);
    },
  });

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
          role: msg.role as Role,
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

  const isSubmitting = status === "streaming" || status === "submitted";

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={chatHistories}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex h-full flex-col border-0 rounded-none shadow-none bg-background">
          <div className="flex-1 p-0 overflow-hidden relative">
            {messages.length === 0 ? (
              <WelcomeChat onPromptSelect={handlePromptSelect} />
            ) : (
              <MessageList messages={messages} isLoading={isSubmitting} />
            )}
          </div>

          <Separator />

          <div className="p-4 bg-background">
            <ChatInputForm
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              files={files}
              fileInputRef={fileInputRef}
              setFiles={setFiles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
