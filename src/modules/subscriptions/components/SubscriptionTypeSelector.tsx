import { useState } from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Check, Calendar, Zap, Star, Crown, Diamond, Shield, Rocket, Heart } from 'lucide-react';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';
import { SubscriptionPlan } from '../types';
import { kopecksToRubles } from '../utils/priceUtils';


interface SubscriptionTypeSelectorProps {
    onSelect: (type: 'monthly' | 'yearly', priceInKopecks: number) => void;
    isLoading?: boolean;
}

const getIconComponent = (iconName: string) => {
    const iconMap = {
        calendar: Calendar,
        zap: Zap,
        star: Star,
        crown: Crown,
        diamond: Diamond,
        shield: Shield,
        rocket: Rocket,
        heart: Heart,
    };

    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Calendar;
    return <IconComponent className="h-6 w-6" />;
};

const getBadgeColorClass = (color: string) => {
    const colorMap = {
        blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        green: 'bg-green-100 text-green-800 hover:bg-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        red: 'bg-red-100 text-red-800 hover:bg-red-200',
        purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
        gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    };

    return colorMap[color as keyof typeof colorMap] || 'bg-blue-100 text-blue-800 hover:bg-blue-200';
};

export const SubscriptionTypeSelector = ({ onSelect, isLoading = false }: SubscriptionTypeSelectorProps) => {
    const [selectedType, setSelectedType] = useState<'monthly' | 'yearly' | null>(null);
    const { data: subscriptionPlans, isLoading: plansLoading, error } = useSubscriptionPlans();

    const handleSelect = (type: 'monthly' | 'yearly', priceInKopecks: number) => {
        setSelectedType(type);
        onSelect(type, priceInKopecks);
    };

    if (plansLoading) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Загрузка планов подписок...</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse shadow-lg">
                            <CardHeader className="space-y-4">
                                <div className="h-6 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Ошибка загрузки планов</h2>
                <p className="text-muted-foreground">Не удалось загрузить планы подписок. Попробуйте позже.</p>
            </div>
        );
    }

    if (!subscriptionPlans || !Array.isArray(subscriptionPlans) || subscriptionPlans.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl font-semibold text-foreground mb-2">Планы подписок недоступны</h2>
                <p className="text-muted-foreground">В данный момент нет доступных планов подписок.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Выберите тип подписки</h2>
                <p className="text-muted-foreground">
                    У вас может быть только одна активная подписка
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.isArray(subscriptionPlans) && subscriptionPlans.map((plan: SubscriptionPlan) => (
                    <Card
                        key={plan.id}
                        className={`relative transition-all duration-200 shadow-lg hover:shadow-xl ${selectedType === plan.type ? 'ring-2 ring-primary shadow-xl' : ''
                            } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    Популярный
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="text-center pb-4 gap-4">
                            <div className="flex justify-center mb-3">
                                {getIconComponent(plan.icon)}
                            </div>
                            <CardTitle className="text-xl text-center font-bold">{plan.name}</CardTitle>
                            <Badge className={`w-fit mx-auto ${getBadgeColorClass(plan.badgeColor)}`}>
                                {plan.duration}
                            </Badge>
                            <div className="mt-4">
                                <span className="text-3xl font-bold text-primary">
                                    {kopecksToRubles(plan.priceInKopecks)}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-muted-foreground text-sm">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-foreground">Включено:</h4>
                                <ul className="space-y-1">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                onClick={() => handleSelect(plan.type as 'monthly' | 'yearly', plan.priceInKopecks)}
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
