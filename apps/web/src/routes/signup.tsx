import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      navigate({ to: "/" });
      return;
    }

    // Email confirmation is required before a session exists.
    setNeedsEmailConfirmation(true);
  }

  if (needsEmailConfirmation) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Élite scouting
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold">Vérifie tes emails</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Un lien de confirmation a été envoyé à <span className="text-foreground">{email}</span>.
          Clique dessus puis connecte-toi.
        </p>
        <Link to="/login" className="mt-6">
          <Button variant="outline">Retour à la connexion</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Élite scouting
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold">Inscription</h1>
          <p className="mt-2 text-sm text-muted-foreground">Crée ton compte scout.</p>
        </div>

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
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
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
            {isSubmitting ? "Création..." : "Créer mon compte"}
          </Button>

          <p className="pt-2 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
