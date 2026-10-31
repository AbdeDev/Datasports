import { useNavItems } from "@/components/nav-items";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Radio, User as UserIcon } from "lucide-react";

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, navItems, badgeByPath } = useNavItems();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex h-24 items-center border-b border-border px-7">
        <Link to="/" className="group block leading-none">
          <p className="font-heading text-2xl font-black tracking-[-0.05em] italic">
            ELITE<span className="text-primary">75</span>
          </p>
          <p className="mt-1 text-[8px] font-bold tracking-[0.21em] text-muted-foreground uppercase">
            Scouting & player tracking
          </p>
        </Link>
      </div>

      <div className="mx-5 mt-6 flex items-center gap-2 border border-primary/15 bg-primary/5 px-3 py-2 text-[10px] font-bold tracking-widest text-primary uppercase">
        <Radio className="size-3.5" /> Espace scouting
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <p className="px-7 pb-3 text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Navigation
        </p>
        <ul className="space-y-1 px-4">
          {navItems.map(({ to, label, icon: Icon }) => {
            const count = badgeByPath[to] ?? 0;
            return (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="flex items-center gap-3 rounded-md border border-transparent px-3 py-3 text-sm text-muted-foreground transition-all hover:border-border hover:bg-muted/60 hover:text-foreground"
                  activeProps={{
                    className:
                      "!border-primary/25 bg-primary/10 font-semibold text-foreground shadow-[inset_3px_0_0_var(--primary)]",
                  }}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {count > 0 && (
                    <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                      {count > 9 ? "9+" : count}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && (
        <div className="m-4 flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <UserIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.fullName ?? user.email}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title="Se déconnecter"
            aria-label="Se déconnecter"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-destructive",
            )}
          >
            <LogOut className="size-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
