import { CheckCircle, AlertCircle } from 'lucide-react';

interface OrdersInfoProps {
    ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
    usedOrders?: number; // количество использованных заказов
    className?: string;
}

export const OrdersInfo = ({ ordersLimit, usedOrders, className = "" }: OrdersInfoProps) => {
    // Если нет данных о заказах, не отображаем компонент
    if (ordersLimit === undefined && usedOrders === undefined) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>Заказы</span>
            </div>
            
            {ordersLimit === -1 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Безлимитные заказы</span>
                    </div>
                    {usedOrders !== undefined && (
                        <p className="text-xs text-green-600 mt-1">
                            Использовано: {usedOrders}
                        </p>
                    )}
                </div>
            ) : ordersLimit !== undefined ? (
                <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <div className="text-lg font-bold text-blue-800">
                                {ordersLimit}
                            </div>
                            <div className="text-xs text-blue-600">Доступно</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                            <div className="text-lg font-bold text-orange-800">
                                {usedOrders || 0}
                            </div>
                            <div className="text-xs text-orange-600">Использовано</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="text-lg font-bold text-green-800">
                                {Math.max(ordersLimit - (usedOrders || 0), 0)}
                            </div>
                            <div className="text-xs text-green-600">Осталось</div>
                        </div>
                    </div>
                    
                    {/* Прогресс-бар */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    ((usedOrders || 0) / ordersLimit) * 100,
                                    100
                                )}%`
                            }}
                        ></div>
                    </div>
                    
                    {/* Предупреждение при приближении к лимиту */}
                    {ordersLimit > 0 && 
                     (usedOrders || 0) >= ordersLimit * 0.8 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <span className="text-xs text-yellow-800">
                                    {(usedOrders || 0) >= ordersLimit 
                                        ? 'Лимит заказов исчерпан' 
                                        : 'Приближается к лимиту заказов'
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-800">
                            Использовано: {usedOrders || 0}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
