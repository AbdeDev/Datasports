import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type Club = { id: number; name: string; country: string | null };

export function listClubs() {
  return api.get<Club[]>("/api/v1/clubs");
}

export function createClub(data: { name: string; country?: string }) {
  return api.post<Club>("/api/v1/clubs", data);
}

export const clubsQueryOptions = queryOptions({
  queryKey: ["clubs"],
  queryFn: listClubs,
});
