import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordRequirementsText, validatePassword } from "@/features/auth/password";
import { supabase } from "@/lib/supabase";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

function ResetPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // The recovery link redirects here with tokens in the URL hash; the
    // Supabase client parses them into a temporary session on load.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStatus("ready");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setStatus((current) => (current === "checking" && data.session ? "ready" : current));
    });

    const timeout = setTimeout(() => {
      setStatus((current) => (current === "checking" ? "invalid" : current));
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    navigate({ to: "/login", search: { reset: "success" } });
  }

  if (status === "invalid") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
        <div className="flex size-12 items-center justify-center border border-border bg-muted">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold">Lien invalide ou expiré</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Redemande un lien de réinitialisation.
        </p>
        <Link to="/forgot-password" className="mt-6">
          <Button variant="outline">Mot de passe oublié</Button>
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
          <h1 className="mt-2 font-heading text-3xl font-bold">Nouveau mot de passe</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  disabled={status === "checking"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">{passwordRequirementsText}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  disabled={status === "checking"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              {error && (
                <p className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || status === "checking"}
                className="w-full"
              >
                {status === "checking"
                  ? "Vérification..."
                  : isSubmitting
                    ? "Enregistrement..."
                    : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
