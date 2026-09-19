import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type CurrentUser = {
  id: number;
  email: string;
  fullName: string | null;
  role: "scout" | "admin";
};

export function getCurrentUser() {
  return api.get<CurrentUser>("/api/v1/me");
}

export const currentUserQueryOptions = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: getCurrentUser,
  staleTime: 5 * 60 * 1000,
});
