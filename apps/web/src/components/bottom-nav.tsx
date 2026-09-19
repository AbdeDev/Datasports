import { currentUserQueryOptions } from "@/features/auth/api";
import { missionsQueryOptions } from "@/features/missions/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ClipboardList, LayoutDashboard, Shield, Star, User } from "lucide-react";

const baseNavItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/missions", label: "Missions", icon: ClipboardList },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/profile", label: "Profil", icon: User },
] as const;

const pilotageItem = { to: "/admin", label: "Pilotage", icon: Shield } as const;

export function BottomNav() {
  const { data: user } = useQuery(currentUserQueryOptions);
  const { data: missions } = useQuery(missionsQueryOptions);
  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? [...baseNavItems, pilotageItem] : baseNavItems;

  const scoutPendingCount =
    missions?.filter((m) => m.status === "proposee" || m.status === "scout_indisponible").length ??
    0;
  const adminAttentionCount =
    missions?.filter((m) => ["proposee", "a_reattribuer", "scout_indisponible"].includes(m.status))
      .length ?? 0;

  const badgeByPath: Record<string, number> = isAdmin
    ? { "/admin": adminAttentionCount }
    : { "/missions": scoutPendingCount };

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className={cn("grid", navItems.length === 5 ? "grid-cols-5" : "grid-cols-4")}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const count = badgeByPath[to] ?? 0;
          return (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex flex-col items-center justify-center gap-1 py-3 text-muted-foreground"
                activeProps={{ className: "text-primary" }}
              >
                <span className="relative">
                  <Icon className="size-6" />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium tracking-wide uppercase">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
