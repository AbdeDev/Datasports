import { currentUserQueryOptions } from "@/features/auth/api";
import { missionsQueryOptions } from "@/features/missions/api";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, LayoutDashboard, Shield, Star, User } from "lucide-react";

const baseNavItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/missions", label: "Missions", icon: ClipboardList },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/profile", label: "Profil", icon: User },
] as const;

const pilotageItem = { to: "/admin", label: "Pilotage", icon: Shield } as const;

export function useNavItems() {
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

  return { user, navItems, badgeByPath };
}
