import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button';

interface SessionExpiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SessionExpiredModal = ({ isOpen, onClose }: SessionExpiredModalProps) => {
    const handleLoginRedirect = () => {
        onClose();
        window.open('/admin/login', '_blank');
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Сессия истекла</DialogTitle>
                    <DialogDescription>
                        Ваша сессия истекла. Пожалуйста, войдите снова.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={handleLoginRedirect}>
                        Войти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 