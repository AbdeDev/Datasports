import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function RoutePending() {
  return (
    <div className="flex min-h-[50svh] items-center justify-center p-6">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export function RouteError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Erreur inconnue";

  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-heading text-lg font-semibold">Une erreur est survenue</p>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Réessayer
      </Button>
    </div>
  );
}
