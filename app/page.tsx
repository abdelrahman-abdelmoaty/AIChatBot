import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">AI Chat Assistant</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Experience intelligent conversations powered by advanced AI technology
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/chat"
            className="rounded-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Start Chatting
          </Link>
        </div>
      </div>
    </div>
  );
}
