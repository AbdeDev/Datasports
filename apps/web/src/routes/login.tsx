import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/features/auth/api";
import { supabase } from "@/lib/supabase";
import { Link, createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

type LoginSearch = { reset?: "success" };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    reset: search.reset === "success" ? "success" : undefined,
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { reset } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setIsSubmitting(false);
      setError(signInError.message);
      return;
    }

    const user = await getCurrentUser();
    navigate({ to: user.role === "admin" ? "/admin" : "/" });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Élire
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">Accède à tes missions de scouting.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {reset === "success" && (
              <p className="mb-4 border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-500">
                Mot de passe mis à jour. Connecte-toi avec ton nouveau mot de passe.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted-foreground underline underline-offset-4"
                  >
                    Oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error && (
                <p className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </Button>

              <p className="pt-2 text-center text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  S'inscrire
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
