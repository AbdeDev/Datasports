import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-heading text-2xl font-bold">Connexion</h1>

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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4">
            S'inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
