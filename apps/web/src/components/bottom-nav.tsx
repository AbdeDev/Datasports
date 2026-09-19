import { useNavItems } from "@/components/nav-items";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function BottomNav() {
  const { navItems, badgeByPath } = useNavItems();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden",
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
                className="flex flex-col items-center justify-center gap-1 py-3 text-muted-foreground transition-colors active:bg-muted"
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
