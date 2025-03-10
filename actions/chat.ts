import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const getChats = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const chats = await prisma.conversation.findMany({
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

    return chats;
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    throw new Error("Failed to fetch chats");
  }
};
