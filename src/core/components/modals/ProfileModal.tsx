import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button/button';
import { Card, CardContent } from '@/core/components/ui/card';
import { User, Phone, Mail, Calendar, Settings, CheckCircle, Clock, UserCircle } from 'lucide-react';
import { memo } from 'react';
import { formatDateTime } from '@/core/utils/dateUtils';

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

const ProfileModal = memo(({ isOpen, onClose, user }: ProfileModalProps) => {

    const formatDate = (dateString: string | Date) => {
        const dateStr = typeof dateString === 'string' ? dateString : dateString.toISOString();
        return formatDateTime(dateStr);
    };

    const handleEditProfile = () => {
        //onClose();
        //navigate('/profile/edit');
    };


    const getRoleColor = (role: string) => {
        switch (role) {
            case 'customer': return 'bg-blue-100 text-blue-800';
            case 'currier': return 'bg-green-100 text-green-800';
            case 'admin': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] sm:max-h-[95vh] overflow-y-auto sm:mx-auto p-0">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-border">
                    <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold text-foreground">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        Профиль пользователя
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Основная информация */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Аватар и основная информация */}
                        <div className="flex flex-col items-center sm:items-start space-y-4 sm:w-1/3">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                    <User className="h-10 w-10 text-white" />
                                </div>

                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>

                            </div>
                        </div>

                        {/* Контактная информация */}
                        <div className="flex-1 space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Контактная информация</h4>

                            {user.phone && (
                                <Card radius="r16" padding="md" background="white" bordered shadow>
                                    <CardContent className="p-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2  rounded-lg">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Телефон</p>
                                                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                                                </div>
                                            </div>
                                            {user.isPhoneVerified && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Подтвержден</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {user.email && (
                                <Card radius="r16" padding="md" background="white" bordered shadow>
                                    <CardContent className="p-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-50 rounded-lg">
                                                    <Mail className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Email</p>
                                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            {user.isEmailVerified && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Подтвержден</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Дополнительная информация */}
                    {/* <Card radius="r20" padding="lg" background="white" bordered shadow>
                        <CardContent className="p-0">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Дополнительная информация</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Последний вход</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Неизвестно'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Дата регистрации</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        {user.createdAt ? formatDate(user.createdAt) : 'Неизвестно'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Действия */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto order-2 sm:order-1"
                        >
                            Закрыть
                        </Button>
                        {/* <Button
                            onClick={handleEditProfile}
                            className="w-full sm:w-auto order-1 sm:order-2"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Редактировать профиль
                        </Button> */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

ProfileModal.displayName = 'ProfileModal';

export { ProfileModal };
