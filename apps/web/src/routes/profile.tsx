import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold">Profil</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Informations du scout, déconnexion — à venir.
      </p>
    </div>
  );
}
