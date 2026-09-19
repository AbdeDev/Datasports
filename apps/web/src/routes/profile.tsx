import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currentUserQueryOptions } from "@/features/auth/api";
import { missionsQueryOptions } from "@/features/missions/api";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery(currentUserQueryOptions);
  const { data: missions } = useQuery(missionsQueryOptions);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  const terminees = missions?.filter((m) => m.status === "terminee").length ?? 0;
  const acceptees = missions?.filter((m) => m.status === "acceptee").length ?? 0;
  const total = missions?.length ?? 0;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-heading text-2xl font-bold">Profil</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      ) : (
        user && (
          <>
            <Card>
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex size-12 shrink-0 items-center justify-center border border-border bg-muted">
                  <UserIcon className="size-6 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{user.fullName ?? user.email}</p>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Membre depuis{" "}
                    {new Date(user.createdAt).toLocaleDateString("fr-CH", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
              </CardContent>
            </Card>

            {user.role === "scout" && (
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Missions" value={total} />
                <StatTile label="Acceptées" value={acceptees} />
                <StatTile label="Terminées" value={terminees} />
              </div>
            )}
          </>
        )
      )}

      <Button onClick={handleSignOut} size="lg" className="w-full" variant="outline">
        <LogOut className="size-4" />
        Se déconnecter
      </Button>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-3 text-center">
      <p className="font-heading text-2xl font-bold">{value}</p>
      <p className="mt-1 text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
    </Card>
  );
}
