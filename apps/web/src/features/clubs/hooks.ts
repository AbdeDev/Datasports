import { ApiError } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClub } from "./api";

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      toast.success("Club ajouté");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Une erreur est survenue");
    },
  });
}
