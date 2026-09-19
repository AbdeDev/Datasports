import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordRequirementsText, validatePassword } from "@/features/auth/password";
import { supabase } from "@/lib/supabase";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { MailCheck, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setAlreadyRegistered(false);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

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

    // Supabase returns a user with no identities (instead of an error) when
    // the email is already registered — this avoids leaking which emails
    // exist to an anonymous caller, but we still want to guide our own user.
    if (data.user && data.user.identities?.length === 0) {
      setAlreadyRegistered(true);
      return;
    }

    // Email confirmation is required before a session exists.
    setNeedsEmailConfirmation(true);
  }

  if (alreadyRegistered) {
    return (
      <AuthMessage
        icon={<ShieldCheck className="size-6 text-primary" />}
        title="Compte déjà existant"
        description={
          <>
            Un compte existe déjà avec <span className="text-foreground">{email}</span>.
            Connecte-toi, ou réinitialise ton mot de passe si tu l'as oublié.
          </>
        }
        primaryAction={{ to: "/login", label: "Se connecter" }}
        secondaryAction={{ to: "/forgot-password", label: "Mot de passe oublié" }}
      />
    );
  }

  if (needsEmailConfirmation) {
    return (
      <AuthMessage
        icon={<MailCheck className="size-6 text-primary" />}
        title="Vérifie tes emails"
        description={
          <>
            Un lien de confirmation a été envoyé à <span className="text-foreground">{email}</span>.
            Clique dessus puis connecte-toi.
          </>
        }
        primaryAction={{ to: "/login", label: "Retour à la connexion" }}
      />
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="size-2 bg-primary" />
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Elite scouting
            </p>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold">Inscription</h1>
          <p className="mt-2 text-sm text-muted-foreground">Crée ton compte scout.</p>
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

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">{passwordRequirementsText}</p>
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
                <Link
                  to="/login"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Se connecter
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AuthMessage({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  primaryAction: { to: string; label: string };
  secondaryAction?: { to: string; label: string };
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <div className="flex size-12 items-center justify-center border border-border bg-muted">
        {icon}
      </div>
      <h1 className="mt-4 font-heading text-2xl font-bold">{title}</h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-col gap-2">
        <Link to={primaryAction.to}>
          <Button variant="outline" className="w-full">
            {primaryAction.label}
          </Button>
        </Link>
        {secondaryAction && (
          <Link to={secondaryAction.to} className="text-sm text-muted-foreground underline">
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
