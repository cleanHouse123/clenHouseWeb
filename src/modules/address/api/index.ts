import { axiosInstance } from "@/core/config/axios";
import { Address } from "../types";
import { AddressDetails } from "@/modules/orders/types";

export interface CreateUserAddressDto {
  address: Address;
  addressDetails?: AddressDetails;
  isPrimary?: boolean;
  isSupportableArea?: boolean;
}

export interface UserAddress {
  id: string;
  userId: string;
  address: Address | null;
  isPrimary: boolean;
  isSupportableArea: boolean;
  addressDetails: AddressDetails | null;
  created_at: string;
  updated_at: string;
}

export const addressApi = {
  getAddresses: async (query: string): Promise<Address[]> => {
    const response = await axiosInstance.get(
      `/address?query=${query}`
    );
    return response.data;
  },

  isSupportable: async (address: Address): Promise<boolean> => {
    const response = await axiosInstance.post('/address/is-supportable', address);
    return response.data;
  },

  createUserAddress: async (data: CreateUserAddressDto): Promise<UserAddress> => {
    const response = await axiosInstance.post('/user-address', data);
    return response.data;
  },

  getUserAddresses: async (): Promise<UserAddress[]> => {
    const response = await axiosInstance.get('/user-address');
    return response.data;
  },
};
