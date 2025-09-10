import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Package, CreditCard, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderModal } from '@/core/contexts/CreateOrderContext';

export const QuickActions = () => {
    const navigate = useNavigate();
    const { openCreateOrderModal } = useCreateOrderModal();

    const actions = [
        {
            title: 'Создать заказ',
            description: 'Новый заказ',
            icon: Package,
            onClick: openCreateOrderModal,
            isPrimary: true
        },
        {
            title: 'Мои заказы',
            description: 'Все заказы',
            icon: Package,
            onClick: () => navigate('/orders'),
            isPrimary: false
        },
        {
            title: 'Подписки',
            description: 'Управление',
            icon: CreditCard,
            onClick: () => navigate('/subscriptions'),
            isPrimary: false
        }
    ];

    return (
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    Быстрые действия
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={index}
                                variant="ghost"
                                className={`w-full h-auto p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${action.isPrimary
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                                    }`}
                                onClick={action.onClick}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className={`p-2 rounded-lg ${action.isPrimary
                                        ? 'bg-white/20'
                                        : 'bg-gray-100'
                                        }`}>
                                        <Icon className={`h-4 w-4 ${action.isPrimary
                                            ? 'text-white'
                                            : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div className="text-left  min-w-0">
                                        <div className={`font-medium text-sm ${action.isPrimary
                                            ? 'text-white'
                                            : 'text-gray-900'
                                            }`}>
                                            {action.title}
                                        </div>
                                        <div className={` mt-0.5`}>
                                            <span className={`whitespace-break-spaces text-xs ${action.isPrimary
                                                ? 'text-blue-100'
                                                : 'text-gray-500'
                                                }`}>{action.description}</span>
                                        </div>
                                    </div>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
