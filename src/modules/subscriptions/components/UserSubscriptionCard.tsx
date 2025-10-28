import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button/button';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import { UserSubscription } from '../types';
import { DeleteSubscriptionModal } from './DeleteSubscriptionModal';
import { OrdersInfo } from './OrdersInfo';
import { kopecksToRubles } from '../utils/priceUtils';
import { formatDateOnly, isExpiringSoon } from '@/core/utils/dateUtils';


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
        if (!dateString) return 'Не указано';
        return formatDateOnly(dateString);
    };

    const checkExpiringSoon = () => {
        if (userSubscription.status !== 'active') return false;
        return isExpiringSoon(userSubscription.endDate);
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
            <Card className={`transition-all duration-200 shadow-lg ${checkExpiringSoon() ? 'ring-2 ring-yellow-500' : ''}`}>
                <CardHeader className="pb-4">
                    <div className="flex justify-between gap-2 items-start">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {userSubscription.type === 'monthly' ? 'Месячная подписка' : 'Годовая подписка'}
                            </h3>
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
                            {kopecksToRubles(userSubscription.price)}
                        </p>
                    </div>

                    {/* Информация о лимитах заказов */}
                    <OrdersInfo 
                        ordersLimit={userSubscription.ordersLimit}
                        usedOrders={userSubscription.usedOrders}
                    />

                    {userSubscription.status === 'pending' && onPay && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                    <div>
                                        <span className="text-sm text-black font-medium">
                                            Подписка ожидает оплаты
                                        </span>
                                        {userSubscription.paymentUrl && (
                                            <p className="text-xs text-orange-600 mt-1">
                                                Ссылка на оплату готова
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={() => onPay(userSubscription.id)}
                                    size="sm"
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Оплатить
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Кнопка удаления для активных подписок */}
                    {userSubscription.status === 'active' && onDelete && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm text-orange-800 font-medium">
                                        Управление подпиской
                                    </span>
                                </div>
                                <Button
                                    onClick={handleDeleteClick}
                                    size="sm"
                                    variant="primary"
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Удалить
                                </Button>
                            </div>
                        </div>
                    )}

                    {checkExpiringSoon() && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <span className="text-sm text-orange-800 font-medium">
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
