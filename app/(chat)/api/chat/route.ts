import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(app)/(auth)/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { saveChat } from "@/server/chat";
import { getUserById } from "@/server/user";

const model = anthropic("claude-3-haiku-20240307");

export async function POST(req: NextRequest) {
  console.log("chat route");
  try {
    const session = await auth();

    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, conversationId } = await req.json();

    // Get user subscription
    const { user, error } = await getUserById(session.user.id);

    if (!user || error) {
      return NextResponse.json({ error }, { status: 404 });
    }

    // Check if user has exceeded their message limit
    const messageCount = await prisma.message.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
        },
      },
    });

    const subscriptionPlan = user.subscription?.planId || "free";
    const messageLimit = subscriptionPlan === "free" ? 20 : subscriptionPlan === "basic" ? 100 : 1000;

    if (messageCount >= messageLimit) {
      return NextResponse.json({ error: "Message limit reached" }, { status: 403 });
    }

    let conversation;
    if (conversationId) {
      // Get existing conversation
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation || conversation.userId !== user.id) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          name: messages[0].content.slice(0, 100),
        },
      });
    }

    // Save user message to database
    await prisma.message.create({
      data: {
        content: messages[messages.length - 1].content,
        role: "user",
        userId: user.id,
        conversationId: conversation.id,
      },
    });

    // Generate AI response
    const response = streamText({
      model,
      messages,
      onFinish: async (message) => {
        console.log("message", message.text);
        await saveChat({ conversationId: conversation.id, content: message.text, role: "assistant" });
      },
    });

    // Create headers with conversation ID
    const headers = new Headers();
    headers.append("x-conversation-id", conversation.id);

    // Return the stream response
    return response.toDataStreamResponse({ headers });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
