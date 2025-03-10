import { NextResponse } from "next/server";
import { hash, compare } from "bcrypt";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const profileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional().or(z.literal("")),
  confirmNewPassword: z.string().optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, currentPassword, newPassword } = profileSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (currentPassword) {
      const passwordsMatch = await compare(currentPassword, existingUser.password);
      if (!passwordsMatch) {
        return new NextResponse("Invalid current password", { status: 400 });
      }
    }

    const updatedData: any = {
      name,
      email,
    };

    if (newPassword) {
      updatedData.password = await hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updatedData,
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}
