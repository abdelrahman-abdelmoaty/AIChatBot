import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const getConversations = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: true,
      },
    });

    return conversations;
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
};
