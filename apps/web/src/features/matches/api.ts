import type { Club } from "@/features/clubs/api";
import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type Match = {
  id: number;
  matchDate: string;
  competition: string | null;
  venue: string | null;
  homeClub: Club | null;
  awayClub: Club | null;
};

export function listMatches() {
  return api.get<Match[]>("/api/v1/matches");
}

export function createMatch(data: {
  homeClubId?: number;
  awayClubId?: number;
  matchDate: string;
  competition?: string;
  venue?: string;
}) {
  return api.post<Match>("/api/v1/matches", data);
}

export const matchesQueryOptions = queryOptions({
  queryKey: ["matches"],
  queryFn: listMatches,
});
