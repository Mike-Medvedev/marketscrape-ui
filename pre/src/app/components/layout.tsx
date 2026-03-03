import { Search } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.3)] group-hover:shadow-[0_0_16px_rgba(250,204,21,0.5)] transition-shadow">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl text-foreground font-mono tracking-tight">marketscrape</span>
          </button>
        </div>
      </header>
      <main className="text-foreground">{children}</main>
    </div>
  );
}