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
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <span>Удаление подписки</span>
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-700 mt-2">
                        Вы уверены, что хотите удалить свою {subscriptionType === 'monthly' ? 'месячную' : 'годовую'} подписку?
                        <span className="block mt-1 text-sm">Это действие нельзя отменить.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-5">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="text-sm text-red-800">
                                <p className="font-semibold mb-1.5 text-red-900">Внимание!</p>
                                <p>После удаления подписки вы потеряете доступ к премиум функциям. Вы сможете оформить новую подписку в любое время.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-1">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="min-w-24"
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 min-w-40"
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
