import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { ChatContainer } from "@/components/chat/chat-container";
import { getConversations } from "@/server/conversation";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { conversations, error } = await getConversations();

  if (error || !conversations) {
    return <div>{error}</div>;
  }

  return <ChatContainer initialConversations={conversations} conversationSlug={null} />;
}
