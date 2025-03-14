"use client";

import {
  Plus,
  MessageSquare,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  Shield,
  Home,
  Sparkles,
  Zap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <div className="w-72 border-r bg-muted/20 py-4 flex flex-col">
      <Link href="/" className="font-goldman font-bold text-4xl mb-4 md:mb-10 px-4">
        Haziq
      </Link>

      <div className="px-4">
        <Button
          onClick={onNewChat}
          className="w-full mb-4 gap-2 shadow-sm hover:shadow-md transition-all"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <div className="mb-2 text-sm font-medium text-muted-foreground px-4">
        {uniqueChats.length > 0 ? "Your conversations" : "No conversations yet"}
      </div>

      <ScrollArea className="flex-1 h-[calc(100vh-500px)]">
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

      <div className="px-4">
        <div className="mt-4  pt-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>Account</span>
                <ChevronRight className="h-4 w-4 ms-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/">
                  Home
                  <Home className="h-4 w-4 ms-auto" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  Settings
                  <Settings className="h-4 w-4 ms-auto" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="opacity-50">
                Free Plan
                <Zap className="h-4 w-4 ms-auto" />
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Help & Resources</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">
                      Pricing
                      <CreditCard className="h-4 w-4 ms-auto" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/support">
                      Support
                      <HelpCircle className="h-4 w-4 ms-auto" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/privacy">
                      Privacy
                      <Shield className="h-4 w-4 ms-auto" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
