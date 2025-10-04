import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button/button';
import { AlertTriangle, XCircle } from 'lucide-react';

interface DeleteSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    subscriptionType?: 'monthly' | 'yearly';
}

export const DeleteSubscriptionModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    subscriptionType = 'monthly'
}: DeleteSubscriptionModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Удаление подписки
                    </DialogTitle>
                    <DialogDescription>
                        Вы уверены, что хотите удалить свою {subscriptionType === 'monthly' ? 'месячную' : 'годовую'} подписку?
                        Это действие нельзя отменить.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div className="text-sm text-red-800">
                                <p className="font-medium mb-1">Внимание!</p>
                                <p>После удаления подписки вы потеряете доступ к премиум функциям.
                                    Вы сможете оформить новую подписку в любое время.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Удаление...
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Удалить подписку
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
