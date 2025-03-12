import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChatContainer } from "@/components/chat/chat-container";
import { getConversations } from "@/actions/conversations";

export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const conversationSlug = (await params).slug;

  const conversations = await getConversations();
  return <ChatContainer initialConversations={conversations} conversationSlug={conversationSlug} />;
}
