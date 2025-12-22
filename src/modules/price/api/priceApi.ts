import { axiosInstance } from "@/core/config/axios";

export interface PriceResponse {
  priceInKopecks: number;
  priceInRubles: number;
  currency: string;
}

export const priceApi = {
  getOrderPrice: async (numberPackages?: number): Promise<PriceResponse> => {
    const params = new URLSearchParams();
    if (numberPackages !== undefined) {
      params.append('numberPackages', numberPackages.toString());
    }
    const queryString = params.toString();
    const url = `/price/order${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get<PriceResponse>(url);
    return response.data;
  }
}
