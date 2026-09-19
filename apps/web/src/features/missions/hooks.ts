import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSpottedPlayer, respondMission, withdrawMission } from "./api";

export function useRespondMission(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { decision: "accept" | "decline"; declineReason?: string }) =>
      respondMission(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });
}

export function useWithdrawMission(missionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason?: string }) => withdrawMission(missionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
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
    },
  });
}
