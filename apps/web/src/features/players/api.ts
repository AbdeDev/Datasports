import type { Club } from "@/features/clubs/api";
import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type Player = {
  id: number;
  firstName: string | null;
  lastName: string;
  officialPosition: string | null;
  status: string;
  club: Club | null;
};

export function listPlayers() {
  return api.get<Player[]>("/api/v1/players");
}

export function createPlayer(data: {
  firstName?: string;
  lastName: string;
  officialPosition?: string;
  clubId?: number;
}) {
  return api.post<Player>("/api/v1/players", data);
}

export const playersQueryOptions = queryOptions({
  queryKey: ["players"],
  queryFn: listPlayers,
});
