import { useQuery } from "@tanstack/react-query";
import { workTimeApi, WorkTime } from "../api";

export const useWorkTime = () => {
  return useQuery<WorkTime[]>({
    queryKey: ["work-time"],
    queryFn: () => workTimeApi.getWorkTimes(),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
};
