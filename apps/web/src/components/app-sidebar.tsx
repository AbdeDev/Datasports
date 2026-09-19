import { useNavItems } from "@/components/nav-items";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon } from "lucide-react";

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, navItems, badgeByPath } = useNavItems();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <span className="size-2.5 shrink-0 bg-primary" />
        <p className="text-sm font-semibold tracking-[0.2em] uppercase">Elite scouting</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-3">
          {navItems.map(({ to, label, icon: Icon }) => {
            const count = badgeByPath[to] ?? 0;
            return (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  activeProps={{
                    className: "!border-primary bg-muted font-medium text-foreground",
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
        <div className="flex items-center gap-3 border-t border-border p-4">
          <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted">
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
