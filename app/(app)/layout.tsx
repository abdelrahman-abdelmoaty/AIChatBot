import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header/header-server";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <HeaderServer />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
