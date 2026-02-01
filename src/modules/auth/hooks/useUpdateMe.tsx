import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../api';
import { User } from '@/core/types/user';

interface UpdateMeData {
  phone?: string;
  name?: string;
  email?: string;
}

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMeData) => authApi.updateMe(data),
    onSuccess: (response) => {
      // Инвалидируем кэш пользователя для обновления данных
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Профиль обновлен', {
        description: 'Ваши данные успешно обновлены',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error('Ошибка обновления профиля:', error);
      toast.error('Ошибка обновления', {
        description: error?.response?.data?.message || 'Не удалось обновить профиль',
        duration: 5000,
      });
    },
  });
};
