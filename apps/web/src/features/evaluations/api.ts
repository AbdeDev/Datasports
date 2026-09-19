import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type EvaluationCriterion = {
  id: number;
  evaluationCategoryId: number;
  name: string;
  displayOrder: number;
};

export type EvaluationCategory = {
  id: number;
  evaluationGridId: number;
  name: string;
  displayOrder: number;
  criteria: EvaluationCriterion[];
};

export type EvaluationGrid = {
  id: number;
  name: string;
  positionType: string;
  isActive: boolean;
  categories: EvaluationCategory[];
};

export const potentialOptions = ["A+", "A", "B", "C", "D"] as const;
export type Potential = (typeof potentialOptions)[number];

export const decisionOptions = ["suivi", "prioritaire", "prise_de_contact", "non_retenu"] as const;
export type ObservationDecision = (typeof decisionOptions)[number];

export const decisionLabels: Record<ObservationDecision, string> = {
  suivi: "À suivre",
  prioritaire: "Prioritaire",
  prise_de_contact: "Prise de contact",
  non_retenu: "Non retenu",
};

export const positionOptions = [
  "GB",
  "DC",
  "DD",
  "DG",
  "MDC",
  "MC",
  "MOC",
  "MD",
  "MG",
  "AD",
  "AG",
  "BU",
] as const;

export type CreateObservationInput = {
  playerId: number;
  playingTimeMinutes?: number;
  weather?: string;
  pitchCondition?: string;
  observedPositions: string[];
  currentLevel: number;
  potential: Potential;
  strengths: string[];
  weaknesses: string[];
  generalComment?: string;
  decision: ObservationDecision;
  answers: { criterionId: number; score: number; comment?: string }[];
};

export type Observation = {
  id: number;
  missionId: number;
  playerId: number;
  decision: ObservationDecision;
};

export function getActiveEvaluationGrid() {
  return api.get<EvaluationGrid>("/api/v1/evaluation-grids/active");
}

export function createObservation(missionId: number, data: CreateObservationInput) {
  return api.post<Observation>(`/api/v1/missions/${missionId}/observations`, data);
}

export const activeEvaluationGridQueryOptions = queryOptions({
  queryKey: ["evaluation-grids", "active"],
  queryFn: getActiveEvaluationGrid,
});
