import { User } from "@/core/types/user";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";


export const useGetMe = () => {
     return useQuery<User>({
        queryKey: ['me'],
        queryFn: () => authApi.getMe(),
        staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
        gcTime: 10 * 60 * 1000, // 10 минут - время хранения в кэше
        refetchOnWindowFocus: false, // не перезагружать при фокусе окна
        refetchOnMount: false, // не перезагружать при монтировании
    })
}
