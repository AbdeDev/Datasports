import { ApiError } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPlayer } from "./api";

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Joueur ajouté");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Une erreur est survenue");
    },
  });
}
