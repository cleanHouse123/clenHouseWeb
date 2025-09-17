import { axiosInstance } from "@/core/config/axios";
import { Address } from "../types";


export const addressApi = {
  getAddresses: async (query: string): Promise<Address[]> => {
    const response = await axiosInstance.get(
      `/address?query=${query}`
    );
    return response.data;
  },
};
