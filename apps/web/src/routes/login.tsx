import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/features/auth/api";
import { supabase } from "@/lib/supabase";
import { Link, createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setIsSubmitting(false);
        setError(
          signInError.code === "email_not_confirmed"
            ? "Confirmez votre adresse email avec le lien reçu avant de vous connecter."
            : signInError.code === "invalid_credentials"
              ? "Email ou mot de passe incorrect. Utilisez les identifiants du compte créé sur ce projet."
              : "Connexion refusée par Supabase. Réessayez ou utilisez « Mot de passe oublié ».",
        );
        return;
      }

      const user = await getCurrentUser();
      navigate({ to: user.role === "admin" ? "/admin" : "/" });
    } catch {
      await supabase.auth.signOut().catch(() => undefined);
      setError("Connexion impossible. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(420px,42%)_1fr]">
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden border-r border-border px-5 py-10 sm:px-10">
        <div className="pointer-events-none absolute -top-32 -left-32 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative w-full max-w-md">
          <Link to="/login" className="inline-block leading-none">
            <p className="font-heading text-3xl font-black tracking-[-0.06em] italic">
              ELITE<span className="text-primary">75</span>
            </p>
            <p className="mt-1 text-[8px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
              Scouting & player tracking
            </p>
          </Link>

          <div className="mt-14">
            <p className="elite-kicker flex items-center gap-2">
              <ShieldCheck className="size-3.5" /> Espace sécurisé
            </p>
            <h1 className="mt-4 font-heading text-4xl leading-[.95] font-black tracking-tight uppercase sm:text-5xl">
              Bon retour
              <br />
              <span className="text-primary">sur le terrain.</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Retrouvez vos missions, vos observations et les profils à suivre.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            {reset === "success" && (
              <div className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
                Mot de passe mis à jour. Vous pouvez vous connecter.
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="scout@elite75.fr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-md bg-card px-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
                >
                  Mot de passe
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] text-muted-foreground transition-colors hover:text-primary"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-md bg-card pr-12 pl-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-12 w-full rounded-md"
            >
              {isSubmitting ? (
                "Connexion..."
              ) : (
                <>
                  Se connecter <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="font-semibold text-foreground hover:text-primary">
                Créer un accès
              </Link>
            </p>
          </form>
        </div>
      </section>

      <section className="relative hidden min-h-svh overflow-hidden bg-[#101416] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(239,35,42,.28),transparent_32%),linear-gradient(135deg,transparent,rgba(0,0,0,.52))]" />
        <div className="pitch-grid absolute inset-0 opacity-35" />
        <div className="absolute top-10 right-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[9px] font-bold tracking-widest text-white/70 uppercase backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-emerald-400" /> Observation · Analyse · Décision
        </div>
        <div className="absolute right-[10%] bottom-[12%] left-[10%] max-w-3xl">
          <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <h2 className="mt-6 font-heading text-5xl leading-[.94] font-black tracking-tight text-white uppercase xl:text-7xl">
            Détecter le potentiel.
            <br />
            <span className="text-primary italic">Confirmer la trajectoire.</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/55">
            Une observation raconte un match. Plusieurs observations révèlent un joueur. Elite75
            transforme cette trajectoire en décision.
          </p>
        </div>
      </section>
    </main>
  );
}
