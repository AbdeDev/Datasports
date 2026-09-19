import { Button } from "@/components/ui/button";
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
        <h1 className="font-heading text-2xl font-bold">Vérifie tes emails</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Un lien de confirmation a été envoyé à {email}. Clique dessus puis connecte-toi.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-heading text-2xl font-bold">Inscription</h1>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Création..." : "Créer mon compte"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
