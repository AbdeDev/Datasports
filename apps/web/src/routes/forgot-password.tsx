import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Link, createFileRoute } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    // Supabase never reveals whether the email exists, to avoid enumeration
    // — the same success state is shown either way.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
        <div className="flex size-12 items-center justify-center border border-border bg-muted">
          <MailCheck className="size-6 text-primary" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold">Vérifie tes emails</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Si un compte existe pour <span className="text-foreground">{email}</span>, un lien de
          réinitialisation vient d'être envoyé.
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
            Élire
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold">Mot de passe oublié</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            On t'envoie un lien pour en choisir un nouveau.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
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

              {error && (
                <p className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Envoi..." : "Envoyer le lien"}
              </Button>

              <p className="pt-2 text-center text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Retour à la connexion
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
