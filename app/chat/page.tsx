import { Metadata } from "next";
import { ChatContainer } from "@/components/chat/chat-container";
import { getChats } from "@/actions/chat";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Chat with our AI assistant",
};

export default async function ChatPage() {
  const chats = await getChats();

  return (
    <div className="container mx-auto py-6">
      <ChatContainer initialChats={chats} />
    </div>
  );
}
