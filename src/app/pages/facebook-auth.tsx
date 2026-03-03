import { ArrowLeft, Monitor } from "lucide-react";
import { useNavigate } from "react-router";
import { Layout } from "../components/layout";
import { Button } from "../components/ui/button";

export function FacebookAuth() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-foreground">Facebook Authentication</h1>
          <p className="text-muted-foreground">
            Log in to Facebook to enable automated searches
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Monitor className="w-4 h-4" />
              VNC Session
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-3 h-3 rounded-full bg-muted" />
              <div className="w-3 h-3 rounded-full bg-muted" />
            </div>
          </div>

          <div className="aspect-video bg-muted/20 flex items-center justify-center p-12">
            <div className="text-center">
              <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                VNC component will be integrated here
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Login session persists via Playwright in Docker container
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}