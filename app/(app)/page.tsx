import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="h-full pb-48 flex flex-col items-center justify-center bg-gradient-to-b">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">AI Chat Assistant</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Experience intelligent conversations powered by advanced AI technology
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" variant="default">
            <Link href="/chat">Start Chatting</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
