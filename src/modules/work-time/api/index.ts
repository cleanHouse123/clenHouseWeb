import { axiosInstance } from "@/core/config/axios";

export interface WorkTime {
  id: number;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export const workTimeApi = {
  // Получить все рабочие часы
  getWorkTimes: async (): Promise<WorkTime[]> => {
    const response = await axiosInstance.get("/work-time");
    return response.data;
  },
};
