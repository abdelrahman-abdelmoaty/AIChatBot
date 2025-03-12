import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 justify-between items-center mx-auto">
        <div className="mr-4 md:mr-6 flex">
          <Button asChild variant="link" className="mr-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">AI Chat Bot</span>
            </Link>
          </Button>
          <nav className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/chat">Chat</Link>
            </Button>
            {session && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">Profile</Link>
              </Button>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {session ? (
              <LogoutButton />
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/signin">
                    Sign In
                    <LogIn className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/signup">
                    Sign Up
                    <UserPlus className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
