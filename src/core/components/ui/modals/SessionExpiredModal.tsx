import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button';
import { useAuthStore } from '@/modules/auth/store/authStore';

export const SessionExpiredModal = () => {
    const { sessionExpired, setSessionExpired } = useAuthStore()

    const handleLoginRedirect = () => {
        setSessionExpired(false)
        window.open('/admin/login', '_blank')
    }

    return (
        <Dialog open={sessionExpired} onOpenChange={setSessionExpired}>
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