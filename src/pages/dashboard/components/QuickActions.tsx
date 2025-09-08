import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Package, CreditCard, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Создать заказ',
            description: 'Новый заказ на вынос мусора',
            icon: Package,
            onClick: () => navigate('/orders'),
            variant: 'default' as const,
            className: 'bg-primary hover:bg-primary/90 text-primary-foreground'
        },
        {
            title: 'Мои заказы',
            description: 'Просмотр всех заказов',
            icon: Package,
            onClick: () => navigate('/orders'),
            variant: 'outline' as const,
            className: ''
        },
        {
            title: 'Подписки',
            description: 'Управление подписками',
            icon: CreditCard,
            onClick: () => navigate('/subscriptions'),
            variant: 'outline' as const,
            className: ''
        },
        {
            title: 'Настройки',
            description: 'Редактировать профиль',
            icon: Settings,
            onClick: () => navigate('/profile/edit'),
            variant: 'outline' as const,
            className: ''
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Быстрые действия
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={index}
                                variant={action.variant}
                                className={`w-full justify-start h-auto p-4 ${action.className}`}
                                onClick={action.onClick}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    <div className="text-left">
                                        <div className="font-medium">{action.title}</div>
                                        <div className="text-xs opacity-80">{action.description}</div>
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
