import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import { UserSubscription } from '../types';
import { DeleteSubscriptionModal } from './DeleteSubscriptionModal';

interface UserSubscriptionCardProps {
    userSubscription: UserSubscription;
    onPay?: (subscriptionId: string) => void;
    onDelete?: (subscriptionId: string) => void;
}

export const UserSubscriptionCard = ({ userSubscription, onPay, onDelete }: UserSubscriptionCardProps) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    console.log('UserSubscriptionCard received data:', userSubscription);
    const getStatusIcon = () => {
        switch (userSubscription.status) {
            case 'active':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-gray-500" />;
            case 'expired':
                return <Clock className="h-5 w-5 text-red-500" />;
            case 'pending':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = () => {
        switch (userSubscription.status) {
            case 'active':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
            case 'expired':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    const getStatusText = () => {

        switch (userSubscription.status) {
            case 'active':
                return 'Активна';
            case 'cancelled':
                return 'Отменена';
            case 'expired':
                return 'Истекла';
            case 'pending':
                return 'Ожидает оплаты';
            default:
                return 'Неизвестно';
        }
    };

    const formatDate = (dateString: string) => {
        console.log('Formatting date:', dateString, 'Type:', typeof dateString);
        if (!dateString) return 'Не указано';

        try {
            // Парсим дату и извлекаем компоненты без конвертации часового пояса
            const date = new Date(dateString);
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();
            const day = date.getUTCDate();

            // Создаем локальную дату без конвертации часового пояса
            const localDate = new Date(year, month, day);

            return localDate.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            console.error('Invalid date:', dateString);
            return 'Неверная дата';
        }
    };

    const isExpiringSoon = () => {
        if (userSubscription.status !== 'active') return false;
        const endDate = new Date(userSubscription.endDate);
        const now = new Date();
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 3 && daysLeft > 0;
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete(userSubscription.id);
        }
        setIsDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <Card className={`transition-all duration-200 ${isExpiringSoon() ? 'ring-2 ring-yellow-500' : ''}`}>
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg font-semibold">
                                {userSubscription.type === 'monthly' ? 'Месячная подписка' : 'Годовая подписка'}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {userSubscription.type === 'monthly' ? 'Подписка на месяц' : 'Подписка на год'}
                            </p>
                        </div>
                        <Badge className={`${getStatusColor()}`}>
                            <div className="flex items-center gap-1">
                                {getStatusIcon()}
                                {getStatusText()}
                            </div>
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Начало</span>
                            </div>
                            <p className="font-medium">{formatDate(userSubscription.startDate)}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Окончание</span>
                            </div>
                            <p className="font-medium">{formatDate(userSubscription.endDate)}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Стоимость</span>
                        </div>
                        <p className="text-lg font-bold text-primary">
                            {userSubscription.price}₽
                        </p>
                    </div>

                    {userSubscription.status === 'pending' && onPay && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                    <div>
                                        <span className="text-sm text-blue-800 font-medium">
                                            Подписка ожидает оплаты
                                        </span>
                                        {userSubscription.paymentUrl && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                Ссылка на оплату готова
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={() => onPay(userSubscription.id)}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Оплатить
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Кнопка удаления для активных подписок */}
                    {userSubscription.status === 'active' && onDelete && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-sm text-red-800 font-medium">
                                        Управление подпиской
                                    </span>
                                </div>
                                <Button
                                    onClick={handleDeleteClick}
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Удалить
                                </Button>
                            </div>
                        </div>
                    )}

                    {isExpiringSoon() && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-yellow-800 font-medium">
                                    Подписка скоро истекает
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DeleteSubscriptionModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                subscriptionType={userSubscription.type}
            />
        </>
    );
};
