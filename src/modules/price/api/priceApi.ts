import { axiosInstance } from "@/core/config/axios";

export interface PriceResponse {
  priceInKopecks: number;
  priceInRubles: number;
  currency: string;
}

export interface GetOrderPriceParams {
  numberPackages?: number;
  addressId?: string;
}

export const priceApi = {
  getOrderPrice: async (params?: GetOrderPriceParams): Promise<PriceResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.numberPackages !== undefined) {
      queryParams.append('numberPackages', params.numberPackages.toString());
    }
    if (params?.addressId) {
      queryParams.append('addressId', params.addressId);
    }
    const queryString = queryParams.toString();
    const url = `/price/order${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get<PriceResponse>(url);
    return response.data;
  }
}
