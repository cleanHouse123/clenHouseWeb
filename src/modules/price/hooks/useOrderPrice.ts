import { useEffect, useState, useCallback } from 'react';
import { priceApi, PriceResponse, GetOrderPriceParams } from '../api/priceApi';

interface UsePriceReturn {
  orderPrice: PriceResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrderPrice(params?: GetOrderPriceParams): UsePriceReturn {
  const [orderPrice, setOrderPrice] = useState<PriceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderPrice = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const price = await priceApi.getOrderPrice(params);
      setOrderPrice(price);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки цены заказа');
      console.error('Error fetching order price:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params?.numberPackages, params?.addressId]);

  useEffect(() => {
    fetchOrderPrice();
  }, [fetchOrderPrice]);

  return {
    orderPrice,
    isLoading,
    error,
    refetch: fetchOrderPrice,
  };
}
