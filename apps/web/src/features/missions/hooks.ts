import { ApiError } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addSpottedPlayer,
  cancelMission,
  createMission,
  reassignMission,
  respondMission,
  withdrawMission,
} from "./api";

function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Une erreur est survenue";
}

export function useRespondMission(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { decision: "accept" | "decline"; declineReason?: string }) =>
      respondMission(missionId, data),
    onSuccess: (_mission, variables) => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success(variables.decision === "accept" ? "Mission acceptée" : "Mission déclinée");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useWithdrawMission(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason?: string }) => withdrawMission(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Désistement enregistré");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useAddSpottedPlayer(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      officialPosition: string;
      clubId: number;
    }) => addSpottedPlayer(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Joueur ajouté à la mission");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useCreateMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Mission créée et attribuée");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useReassignMission(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { scoutId: number }) => reassignMission(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Mission réattribuée");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useCancelMission(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason?: string }) => cancelMission(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Mission annulée");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
