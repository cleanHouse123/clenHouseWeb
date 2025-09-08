import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent } from '@/core/components/ui/card';
import { User, Phone, Mail, Calendar, Settings, X } from 'lucide-react';
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
        lastLoginAt?: string;
        createdAt?: string;
    };
}

export const ProfileModal = ({ isOpen, onClose, user }: ProfileModalProps) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditProfile = () => {
        onClose();
        navigate('/profile/edit');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Информация о профиле
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Основная информация */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Имя
                                    </label>
                                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-foreground">{user.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Роль
                                    </label>
                                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-foreground capitalize">
                                            {user.role === 'customer' ? 'Клиент' :
                                                user.role === 'currier' ? 'Курьер' :
                                                    user.role === 'admin' ? 'Администратор' : user.role}
                                        </span>
                                    </div>
                                </div>

                                {user.phone && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Телефон
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-foreground">{user.phone}</span>
                                            {user.isPhoneVerified && (
                                                <span className="text-green-600 text-xs">✓ Подтвержден</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {user.email && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-foreground">{user.email}</span>
                                            {user.isEmailVerified && (
                                                <span className="text-green-600 text-xs">✓ Подтвержден</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Дополнительная информация */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Последний вход
                                    </label>
                                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-foreground">
                                            {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Неизвестно'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Дата регистрации
                                    </label>
                                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-foreground">
                                            {user.createdAt ? formatDate(user.createdAt) : 'Неизвестно'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Действия */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Закрыть
                        </Button>
                        <Button onClick={handleEditProfile}>
                            <Settings className="h-4 w-4 mr-2" />
                            Редактировать профиль
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
