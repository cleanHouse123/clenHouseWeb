import { Button } from '@/core/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';
import { Subscription } from '../types';
import { kopecksToRubles } from '../utils/priceUtils';

interface SubscriptionCardProps {
    subscription: Subscription;
    onSelect: (subscription: Subscription) => void;
    isSelected?: boolean;
    isLoading?: boolean;
}

export const SubscriptionCard = ({
    subscription,
    onSelect,
    isSelected = false,
    isLoading = false
}: SubscriptionCardProps) => {
    const getIcon = () => {
        switch (subscription.name.toLowerCase()) {
            case 'базовая':
                return <Zap className="h-6 w-6 text-blue-500" />;
            case 'премиум':
                return <Star className="h-6 w-6 text-yellow-500" />;
            case 'профессиональная':
                return <Star className="h-6 w-6 text-purple-500" />;
            default:
                return <Zap className="h-6 w-6 text-green-500" />;
        }
    };

    const getBadgeColor = () => {
        switch (subscription.name.toLowerCase()) {
            case 'базовая':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            case 'премиум':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'профессиональная':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
            default:
                return 'bg-green-100 text-green-800 hover:bg-green-200';
        }
    };

    return (
        <Card
            className={`relative transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                    {getIcon()}
                </div>
                <CardTitle className="text-xl font-bold">{subscription.name}</CardTitle>
                <Badge className={`w-fit mx-auto ${getBadgeColor()}`}>
                    {subscription.duration} дней
                </Badge>
                <div className="mt-4">
                    <span className="text-3xl font-bold text-primary">
                        {kopecksToRubles(subscription.price)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                        /{subscription.duration} дней
                    </span>
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
                    onClick={() => onSelect(subscription)}
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Обработка...' : 'Выбрать подписку'}
                </Button>
            </CardContent>
        </Card>
    );
};
