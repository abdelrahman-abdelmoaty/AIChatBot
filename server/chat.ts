import { prisma } from "@/lib/db";
import { auth } from "@/app/(auth)/auth";
import { Role } from "@/lib/types";
export const saveChat = async ({
  conversationId,
  content,
  role,
}: {
  conversationId: string;
  content: string;
  role: Role;
}) => {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const message = await prisma.message.create({
      data: {
        content,
        role: role,
        userId: session.user.id,
        conversationId,
      },
    });

    return message;
  } catch (error) {
    console.error("Failed to save chat message:", error);
    throw new Error("Failed to save chat message");
  }
};
