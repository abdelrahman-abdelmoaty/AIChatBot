import Link from "next/link";

export function Footer() {
  return (
    <footer className="container flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Haziq. All rights reserved.</p>
      <div className="flex items-center space-x-4">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Terms & Conditions
        </Link>
        <Link href="/support" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Support
        </Link>
      </div>
    </footer>
  );
}
