import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { LoginEmailDto } from "../types";
import { toastManager } from "@/core/components/ui/toast/toast";
import { handleApiError } from "@/core/utils/errorHandler";


export const useLoginByEmail = () => {
    return useMutation({
        mutationFn: (data: LoginEmailDto) => authApi.login(data),
        onError: (error) => {
            toastManager.error(handleApiError(error, 'Login failed'));
        }
    })
}
