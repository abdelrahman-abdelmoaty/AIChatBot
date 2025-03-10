import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    console.log("session", session);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chats = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("chats", chats);

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Failed to fetch chats", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
