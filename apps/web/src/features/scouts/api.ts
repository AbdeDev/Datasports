import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type Scout = { id: number; email: string; fullName: string | null };

export function listScouts() {
  return api.get<Scout[]>("/api/v1/scouts");
}

export const scoutsQueryOptions = queryOptions({
  queryKey: ["scouts"],
  queryFn: listScouts,
});
