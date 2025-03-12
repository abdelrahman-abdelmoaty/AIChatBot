import { Metadata } from "next";
import { redirect } from "next/navigation";

import { ChatContainer } from "@/components/chat/chat-container";
import { getConversations } from "@/actions/conversations";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Chat with our AI assistant",
};

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const conversations = await getConversations();

  return <ChatContainer initialConversations={conversations} conversationSlug={null} />;
}
