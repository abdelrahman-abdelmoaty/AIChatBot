import { redirect } from "next/navigation";
import { auth } from "@/app/(app)/(auth)/auth";
import { ChatContainer } from "@/components/chat/chat-container";
import { getConversation, getConversations } from "@/server/conversation";
import { notFound } from "next/navigation";
export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const conversationSlug = (await params).slug;

  const [{ conversations, error }, { conversation, error: conversationError }] = await Promise.all([
    getConversations(),
    getConversation(conversationSlug),
  ]);

  if (error || !conversations) {
    return <div>{error}</div>;
  }

  if (conversationError || !conversation) {
    notFound();
  }

  return <ChatContainer initialConversations={conversations} conversationSlug={conversationSlug} />;
}
