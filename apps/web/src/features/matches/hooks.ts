import { ApiError } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMatch } from "./api";

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Match ajouté");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Une erreur est survenue");
    },
  });
}
