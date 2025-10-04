import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button/button';
import { Card, CardContent } from '@/core/components/ui/card';
import { User, Phone, Mail, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name: string;
        role: string;
        phone?: string;
        email?: string;
        isPhoneVerified?: boolean;
        isEmailVerified?: boolean;
        lastLoginAt?: string | Date;
        createdAt?: string | Date;
    };
}

export const ProfileModal = ({ isOpen, onClose, user }: ProfileModalProps) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string | Date) => {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditProfile = () => {
        //onClose();
        //navigate('/profile/edit');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto mx-4 sm:mx-auto">
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                            Информация о профиле
                        </DialogTitle>
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6">
                    {/* Основная информация */}
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Имя
                                    </label>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
                                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="text-foreground text-sm sm:text-base truncate">{user.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Роль
                                    </label>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
                                        <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="text-foreground text-sm sm:text-base capitalize">
                                            {user.role === 'customer' ? 'Клиент' :
                                                user.role === 'currier' ? 'Курьер' :
                                                    user.role === 'admin' ? 'Администратор' : user.role}
                                        </span>
                                    </div>
                                </div>

                                {user.phone && (
                                    <div className="space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                            Телефон
                                        </label>
                                        <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
                                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-foreground text-sm sm:text-base">{user.phone}</span>
                                            {user.isPhoneVerified && (
                                                <span className="text-green-600 text-xs ml-auto">✓ Подтвержден</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {user.email && (
                                    <div className="space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                            Email
                                        </label>
                                        <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
                                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-foreground text-sm sm:text-base truncate">{user.email}</span>
                                            {user.isEmailVerified && (
                                                <span className="text-green-600 text-xs ml-auto">✓ Подтвержден</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Дополнительная информация */}
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Последний вход
                                    </label>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="text-foreground text-xs sm:text-sm">
                                            {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Неизвестно'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        Дата регистрации
                                    </label>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded-lg">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="text-foreground text-xs sm:text-sm">
                                            {user.createdAt ? formatDate(user.createdAt) : 'Неизвестно'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Действия */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Закрыть
                        </Button>
                        <Button onClick={handleEditProfile} className="w-full sm:w-auto">
                            <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            <span className="hidden sm:inline">Редактировать профиль</span>
                            <span className="sm:hidden">Редактировать</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
