"use client";

import Link from "next/link";
import { LogIn, UserPlus, User, Settings, LogOut } from "lucide-react";
import { Session } from "next-auth";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/app/(app)/(auth)/actions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function HeaderClient({ session }: { session: Session | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="container flex h-14 justify-between items-center mx-auto">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-goldman font-bold text-4xl">
            Haziq
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn({
                "bg-accent  text-accent-foreground": pathname === "/chat",
              })}
            >
              <Link href="/chat">Chat</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn({
                "bg-accent  text-accent-foreground": pathname === "/pricing",
              })}
            >
              <Link href="/pricing">Pricing</Link>
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      Settings
                      <Settings className="h-4 w-4 ms-auto" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                    <LogOut className="h-4 w-4 ms-auto" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/sign-in">
                    Sign In
                    <LogIn className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/sign-up">
                    Sign Up
                    <UserPlus className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
