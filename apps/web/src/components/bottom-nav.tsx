import { useNavItems } from "@/components/nav-items";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function BottomNav() {
  const { navItems, badgeByPath } = useNavItems();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 shadow-[0_-8px_30px_rgba(0,0,0,.35)] backdrop-blur-xl md:hidden",
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
                className="relative flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors active:bg-muted"
                activeProps={{ className: "text-primary after:absolute after:top-0 after:h-0.5 after:w-8 after:bg-primary" }}
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
