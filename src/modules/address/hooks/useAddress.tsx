import { useMutation, useQuery } from '@tanstack/react-query';
import { addressApi, CreateUserAddressDto } from '../api';
import { Address } from '../types';
import queryClient from '@/core/config/query';

interface UseUserAddressesOptions {
  enabled?: boolean;
}

// Получить список адресов
export const useAddresses = (searchAddress: string) => {
    return useQuery({
        queryKey: ['address', searchAddress],
        queryFn: () => addressApi.getAddresses(searchAddress),
        staleTime: 0,
        gcTime: 0,
    });
};

export const useCheckAddressSupport = () => {
  return useMutation({
    mutationFn: (address: Address) => addressApi.isSupportable(address),
  });
};

export const useCreateUserAddress = () => {
  return useMutation({
    mutationFn: (data: CreateUserAddressDto) => addressApi.createUserAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
  });
};

export const useUserAddresses = (options?: UseUserAddressesOptions) => {
  return useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => addressApi.getUserAddresses(),
    enabled: options?.enabled ?? true,
  });
};