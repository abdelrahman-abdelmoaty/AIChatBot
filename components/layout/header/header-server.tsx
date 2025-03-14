import { auth } from "@/app/(app)/(auth)/auth";
import { HeaderClient } from "./header-client";

export async function HeaderServer() {
  const session = await auth();

  return <HeaderClient session={session} />;
}
