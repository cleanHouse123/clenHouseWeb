import { useState } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Check, Calendar, Zap } from 'lucide-react';

interface SubscriptionTypeSelectorProps {
    onSelect: (type: 'monthly' | 'yearly', price: number) => void;
    isLoading?: boolean;
}

export const SubscriptionTypeSelector = ({ onSelect, isLoading = false }: SubscriptionTypeSelectorProps) => {
    const [selectedType, setSelectedType] = useState<'monthly' | 'yearly' | null>(null);

    const subscriptionTypes = [
        {
            type: 'monthly' as const,
            name: 'Месячная подписка',
            description: 'Подписка на месяц с доступом ко всем функциям',
            price: 1000,
            duration: '1 месяц',
            features: [
                'Неограниченное количество заказов',
                'Приоритетная поддержка',
                'Уведомления в реальном времени',
                'История заказов'
            ],
            icon: <Calendar className="h-6 w-6 text-blue-500" />,
            badgeColor: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
            popular: false
        },
        {
            type: 'yearly' as const,
            name: 'Годовая подписка',
            description: 'Подписка на год со скидкой 20%',
            price: 9600, // 1000 * 12 * 0.8
            duration: '12 месяцев',
            features: [
                'Неограниченное количество заказов',
                'Приоритетная поддержка',
                'Уведомления в реальном времени',
                'История заказов',
                'Эксклюзивные функции',
                'Скидка 20%'
            ],
            icon: <Zap className="h-6 w-6 text-purple-500" />,
            badgeColor: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
            popular: true
        }
    ];

    const handleSelect = (type: 'monthly' | 'yearly', price: number) => {
        setSelectedType(type);
        onSelect(type, price);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Выберите тип подписки</h2>
                <p className="text-muted-foreground">
                    У вас может быть только одна активная подписка
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionTypes.map((subscription) => (
                    <Card
                        key={subscription.type}
                        className={`relative transition-all duration-200 hover:shadow-lg ${selectedType === subscription.type ? 'ring-2 ring-primary shadow-lg' : ''
                            } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {subscription.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    Популярный
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-3">
                                {subscription.icon}
                            </div>
                            <CardTitle className="text-xl font-bold">{subscription.name}</CardTitle>
                            <Badge className={`w-fit mx-auto ${subscription.badgeColor}`}>
                                {subscription.duration}
                            </Badge>
                            <div className="mt-4">
                                <span className="text-3xl font-bold text-primary">
                                    {subscription.price}₽
                                </span>
                                {subscription.type === 'yearly' && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                        <span className="line-through">12000₽</span>
                                        <span className="ml-2 text-green-600 font-medium">-20%</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-muted-foreground text-sm">
                                    {subscription.description}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-foreground">Включено:</h4>
                                <ul className="space-y-1">
                                    {subscription.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                onClick={() => handleSelect(subscription.type, subscription.price)}
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Обработка...' : 'Выбрать подписку'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
