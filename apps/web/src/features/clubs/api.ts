import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type Club = { id: number; name: string; country: string | null };

export function listClubs() {
  return api.get<Club[]>("/api/v1/clubs");
}

export const clubsQueryOptions = queryOptions({
  queryKey: ["clubs"],
  queryFn: listClubs,
});
