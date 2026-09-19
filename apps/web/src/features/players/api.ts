import type { Club } from "@/features/clubs/api";
import type { ObservationDecision } from "@/features/evaluations/api";
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

export const playerStatusLabels: Record<string, string> = {
  decouvert: "Découvert",
  a_observer: "À observer",
  suivi: "Suivi",
  prioritaire: "Prioritaire",
  prise_de_contact: "Prise de contact",
  contacte: "Contacté",
  non_retenu: "Non retenu",
  archive: "Archivé",
};

export const playerStatusOrder = [
  "prioritaire",
  "prise_de_contact",
  "suivi",
  "a_observer",
  "decouvert",
  "contacte",
  "non_retenu",
  "archive",
];

type UserSummary = { id: number; fullName: string | null; email: string };

type StatusHistoryEntry = {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
  changedByUser: UserSummary | null;
};

type ObservationSummary = {
  id: number;
  currentLevel: number | null;
  potential: string | null;
  decision: ObservationDecision | null;
  strengths: string[];
  weaknesses: string[];
  generalComment: string | null;
  analysisGenerated: string | null;
  analysisValidated: string | null;
  createdAt: string;
  mission: {
    id: number;
    scout: UserSummary;
    match: {
      id: number;
      matchDate: string;
      competition: string | null;
      homeClub: Club | null;
      awayClub: Club | null;
    };
  };
};

export type PlayerDetail = Player & {
  dateOfBirth: string | null;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
  observations: ObservationSummary[];
};

export function listPlayers() {
  return api.get<Player[]>("/api/v1/players");
}

export function getPlayer(id: number) {
  return api.get<PlayerDetail>(`/api/v1/players/${id}`);
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

export const playerQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["players", id],
    queryFn: () => getPlayer(id),
  });
