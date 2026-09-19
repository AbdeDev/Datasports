import { ApiError } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type CreateObservationInput, createObservation, validateAnalysis } from "./api";

function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Une erreur est survenue";
}

export function useCreateObservation(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateObservationInput) => createObservation(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Évaluation envoyée");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useValidateAnalysis(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (analysisValidated: string) => validateAnalysis(missionId, analysisValidated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Analyse validée");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
