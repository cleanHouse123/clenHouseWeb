import { Button } from '@/core/components/ui/button/button';
import { Card, CardContent } from '@/core/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { PushNotificationSettings } from '@/core/components/ui/PushNotificationSettings';
import { UserAddressesList } from '@/modules/address/ui/user-adresses';
import { useCreateRefferalLink } from '@/modules/referral/hooks/useCreateRefferalLink';
import { ReferralLink } from '@/modules/referral/types';
import { CheckCircle, Loader2, Mail, Phone, User, UserCircle } from 'lucide-react';
import { memo } from 'react';
import { toast } from 'sonner';

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
        adToken?: ReferralLink;
        lastLoginAt?: string | Date;
        createdAt?: string | Date;
    };
}

const ProfileModal = memo(({ isOpen, onClose, user }: ProfileModalProps) => {

    const { mutate: createReferralLink, isPending: isCreatingReferralLink } = useCreateRefferalLink();

    const referralLink = `https://выносмусора.рф/?adToken=${user.adToken?.token}`;
    const handleGenerateReferralLink = () => {
        createReferralLink();
    };

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Ссылка скопирована в буфер обмена');
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

                    {
                        user?.adToken ? (
                            <Card radius="r16" padding="md" background="white" bordered shadow>
                                <CardContent className="p-0 gap-2 flex flex-col">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Реферальная ссылка</h4>
                                    <p className="text-sm font-medium text-foreground hover:text-primary cursor-pointer" onClick={handleCopyReferralLink}>{referralLink}</p>
                                    <p className="text-sm text-primary font-bold">{user.adToken.clickCount} пользователей использовали вашу ссылку</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card radius="r16" padding="md" background="white" bordered shadow>
                                <CardContent className="p-0">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Реферальная ссылка</h4>
                                    <Button variant="outline" className="w-full" onClick={handleGenerateReferralLink} disabled={isCreatingReferralLink}>Создать реферальную ссылку</Button>
                                    {isCreatingReferralLink && (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    }

                    {/* Push уведомления
                    <PushNotificationSettings /> */}

                    {/* Адреса пользователя */}
                    <Card radius="r16" padding="md" background="white" bordered shadow>
                        <CardContent className="p-0">
                            <UserAddressesList />
                        </CardContent>
                    </Card>

                    {/* Связаться с компанией */}
                    <Card radius="r16" padding="md" background="white" bordered shadow>
                        <CardContent className="p-0">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Связаться с компанией</h4>
                            <div className="space-y-2">
                                <a
                                    href="tel:+78007756365"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Phone className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">Телефон поддержки</p>
                                        <p className="text-sm text-muted-foreground">8-800-775-63-65</p>
                                    </div>
                                </a>
                                <a
                                    href="mailto:chisto.doma1@mail.ru?subject=Жалоба"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Mail className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">Написать жалобу</p>
                                        <p className="text-sm text-muted-foreground">chisto.doma1@mail.ru</p>
                                    </div>
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Действия */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto order-2 sm:order-1"
                        >
                            Закрыть
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

ProfileModal.displayName = 'ProfileModal';

export { ProfileModal };
