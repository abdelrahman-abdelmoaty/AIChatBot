"use client";

import { Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation } from "@/lib/types";

export function ChatSidebar({
  conversations,
  currentChatId,
  onNewChat,
  onChatSelect,
}: {
  conversations: Conversation[];
  currentChatId: string | null;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
}) {
  // Format timestamp for display - simplified for sidebar
  const formatTimestamp = (date: Date) => {
    try {
      return format(new Date(date), "MMM d, h:mm a");
    } catch (e) {
      return "Recent"; // Fallback if date is invalid
    }
  };

  // Generate chat name
  const getChatName = (chat: Conversation) => {
    return chat.name || "New Chat";
  };

  // Deduplicate chats by content if needed
  const uniqueChats = conversations.filter((chat, index, self) => index === self.findIndex((c) => c.id === chat.id));

  return (
    <div className="w-72 border-r bg-muted/20 p-4 flex flex-col">
      <Button
        onClick={onNewChat}
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
              onClick={() => onChatSelect(chat.id)}
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
  );
}
