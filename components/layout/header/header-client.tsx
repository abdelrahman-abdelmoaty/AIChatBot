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
import { signOut } from "@/app/(auth)/actions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function HeaderClient({ session }: { session: Session | null }) {
  const pathname = usePathname();

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
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
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
          </nav>
        </div>
      </div>
    </header>
  );
}
