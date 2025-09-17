import { useQuery } from '@tanstack/react-query';
import { addressApi } from '../api';

// Получить список заказов
export const useAddresses = (searchAddress: string) => {
    return useQuery({
        queryKey: ['address', searchAddress],
        queryFn: () => addressApi.getAddresses(searchAddress),
        staleTime: 30000,
    });
};