import { User } from "@/core/types/user";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "../store/authStore";

export const useGetMe = () => {
    const { accessToken } = useAuthStore();

    return useQuery<User>({
        queryKey: ['me'],
        queryFn: () => authApi.getMe(),
        enabled: !!accessToken, // Выполнять запрос только если есть токен
        staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
        gcTime: 10 * 60 * 1000, // 10 минут - время хранения в кэше
        refetchOnWindowFocus: false, // не перезагружать при фокусе окна
        refetchOnMount: false, // не перезагружать при монтировании
        retry: (failureCount, error: any) => {
            // Не повторять запрос при 401 ошибке (неавторизован)
            if (error?.response?.status === 401) {
                return false;
            }
            // Повторить максимум 2 раза для других ошибок
            return failureCount < 2;
        },
    })
}
