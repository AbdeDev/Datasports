import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type MissionStatus =
  | "proposee"
  | "acceptee"
  | "a_venir"
  | "evaluation_a_completer"
  | "terminee"
  | "scout_indisponible"
  | "a_reattribuer"
  | "annulee";

export const missionStatusLabels: Record<MissionStatus, string> = {
  proposee: "Proposée",
  acceptee: "Acceptée",
  a_venir: "À venir",
  evaluation_a_completer: "Évaluation à compléter",
  terminee: "Terminée",
  scout_indisponible: "Scout indisponible",
  a_reattribuer: "À réattribuer",
  annulee: "Annulée",
};

export const missionStatusVariants: Record<
  MissionStatus,
  "default" | "secondary" | "outline" | "muted" | "success" | "warning" | "destructive"
> = {
  proposee: "outline",
  acceptee: "success",
  a_venir: "outline",
  evaluation_a_completer: "warning",
  terminee: "secondary",
  scout_indisponible: "warning",
  a_reattribuer: "warning",
  annulee: "destructive",
};

export type Club = { id: number; name: string; country: string | null };

export type PlayerSummary = {
  id: number;
  firstName: string | null;
  lastName: string;
  officialPosition: string | null;
  status: string;
};

export type MatchSummary = {
  id: number;
  matchDate: string;
  competition: string | null;
  venue: string | null;
  homeClub: Club | null;
  awayClub: Club | null;
};

export type ScoutSummary = { id: number; email: string; fullName: string | null };

export type Mission = {
  id: number;
  matchId: number;
  scoutId: number;
  status: MissionStatus;
  declineReason: string | null;
  respondedAt: string | null;
  createdAt: string;
  match: MatchSummary;
  scout: ScoutSummary;
  targets: { id: number; player: PlayerSummary }[];
};

export function listMissions() {
  return api.get<Mission[]>("/api/v1/missions");
}

export function getMission(id: number) {
  return api.get<Mission>(`/api/v1/missions/${id}`);
}

export function respondMission(
  id: number,
  data: { decision: "accept" | "decline"; declineReason?: string },
) {
  return api.post<Mission>(`/api/v1/missions/${id}/respond`, data);
}

export function withdrawMission(id: number, data: { reason?: string }) {
  return api.post<Mission>(`/api/v1/missions/${id}/withdraw`, data);
}

export function addSpottedPlayer(
  id: number,
  data: { firstName: string; lastName: string; officialPosition: string; clubId: number },
) {
  return api.post<Mission>(`/api/v1/missions/${id}/targets`, data);
}

export function cancelMission(id: number, data: { reason?: string }) {
  return api.post<Mission>(`/api/v1/missions/${id}/cancel`, data);
}

export function createMission(data: { matchId: number; scoutId: number; playerIds: number[] }) {
  return api.post<Mission>("/api/v1/missions", data);
}

export function reassignMission(id: number, data: { scoutId: number }) {
  return api.post<Mission>(`/api/v1/missions/${id}/reassign`, data);
}

export const missionsQueryOptions = queryOptions({
  queryKey: ["missions"],
  queryFn: listMissions,
});

export const missionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["missions", id],
    queryFn: () => getMission(id),
  });
