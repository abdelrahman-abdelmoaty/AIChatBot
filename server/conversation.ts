import "server-only";

import { prisma } from "@/lib/db";
import { auth } from "@/app/(app)/(auth)/auth";

export const getConversations = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return { conversations };
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return { error: "Failed to fetch conversations" };
  }
};

export const getConversation = async (conversationId: string) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return { error: "Conversation not found" };
    }

    return { conversation };
  } catch (error) {
    console.error("Failed to fetch conversation:", error);
    return { error: "Failed to fetch conversation" };
  }
};
