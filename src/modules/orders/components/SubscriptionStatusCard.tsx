import { Button } from '@/core/components/ui/button';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionStatusCardProps {
    hasActiveSubscription: boolean;
}

export const SubscriptionStatusCard = ({ hasActiveSubscription }: SubscriptionStatusCardProps) => {
    const navigate = useNavigate();

    const handleGoToSubscriptions = () => {
        navigate('/subscriptions');
    };

    return (
        <div className="mb-4 p-3 rounded-lg border">
            {hasActiveSubscription ? (
                <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">У вас активная подписка</span>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Нет активной подписки</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGoToSubscriptions}
                        className="flex items-center gap-1 text-xs"
                    >
                        Оформить подписку
                        <ArrowRight className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
};
