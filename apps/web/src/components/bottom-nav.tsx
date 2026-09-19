import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ClipboardList, LayoutDashboard, Star, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/missions", label: "Missions", icon: ClipboardList },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className="grid grid-cols-4">
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
