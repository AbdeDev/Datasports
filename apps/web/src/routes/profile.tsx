import { Button } from "@/components/ui/button";
import { currentUserQueryOptions } from "@/features/auth/api";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery(currentUserQueryOptions);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Profil</h1>

      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
      ) : (
        user && (
          <div className="mt-4 space-y-1 text-sm">
            <p>{user.fullName ?? user.email}</p>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-muted-foreground uppercase">{user.role}</p>
          </div>
        )
      )}

      <Button onClick={handleSignOut} className="mt-6 w-full" variant="outline">
        Se déconnecter
      </Button>
    </div>
  );
}
