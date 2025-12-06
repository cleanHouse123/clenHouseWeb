import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { referralApi } from "../api";
import queryClient from "@/core/config/query";

export const useCreateRefferalLink = () => {
  return useMutation({
    mutationFn: () => referralApi.createReferralLink(),
    onSuccess: () => {
      toast.success("Реферальная ссылка создана!", {
        description: `Реферальная ссылка создана`,
        duration: 4000,
      });

      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Ошибка создания реферальной ссылки";
      toast.error(errorMessage);
    },
  });
};
