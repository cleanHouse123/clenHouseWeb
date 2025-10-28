import { axiosInstance } from "@/core/config/axios";

export interface PriceResponse {
  priceInKopecks: number;
  priceInRubles: number;
  currency: string;
}

export const priceApi = {
  getOrderPrice: async (): Promise<PriceResponse> => {
    const response = await axiosInstance.get<PriceResponse>('/price/order');
    return response.data;
  }
}
