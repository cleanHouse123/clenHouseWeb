import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000, // 1 минута по умолчанию
        gcTime: 3 * 60 * 1000, // 3 минуты по умолчанию
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

export default queryClient;