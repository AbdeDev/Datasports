import { isDemo } from "./lib/demo-mode";
import "./styles.css";

const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "VITE_API_URL"] as const;
const missing = required.filter((key) => !import.meta.env[key]);
const root = document.getElementById("app");

if (!isDemo && missing.length && root) {
  const panel = document.createElement("main");
  panel.className = "mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-5 p-8";
  const brand = document.createElement("p");
  brand.className = "elite-kicker";
  brand.textContent = "ELITE75 · Configuration";
  const title = document.createElement("h1");
  title.className = "text-3xl font-black";
  title.textContent = "Votre espace est prêt à être connecté.";
  const description = document.createElement("p");
  description.className = "text-muted-foreground";
  description.textContent =
    "Copiez apps/web/.env.example vers apps/web/.env, renseignez la configuration fournie par votre équipe puis relancez Vite.";
  const details = document.createElement("p");
  details.className = "rounded-lg border border-border bg-card p-4 text-sm";
  details.textContent = "Variables manquantes : " + missing.join(", ");
  panel.append(brand, title, description, details);
  root.append(panel);
} else {
  void import("./bootstrap");
}
