import { currentUserQueryOptions } from "@/features/auth/api";
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
  const navItems = user?.role === "admin" ? [...baseNavItems, pilotageItem] : baseNavItems;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className={cn("grid", navItems.length === 5 ? "grid-cols-5" : "grid-cols-4")}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center justify-center gap-1 py-3 text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="size-6" />
              <span className="text-[11px] font-medium tracking-wide uppercase">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
