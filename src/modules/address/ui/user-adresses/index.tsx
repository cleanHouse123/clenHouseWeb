import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { useUserAddresses } from '@/modules/address/hooks/useAddress';
import { MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { UserAddress } from '@/modules/address/api';

const AddressCard: React.FC<{ address: UserAddress }> = ({ address }) => {
  const formatAddressDetails = () => {
    if (!address.addressDetails) return null;
    
    const details = [];
    if (address.addressDetails.building) details.push(`Дом ${address.addressDetails.building}`);
    if (address.addressDetails.buildingBlock) details.push(`Корп. ${address.addressDetails.buildingBlock}`);
    if (address.addressDetails.entrance) details.push(`Подъезд ${address.addressDetails.entrance}`);
    if (address.addressDetails.floor) details.push(`Этаж ${address.addressDetails.floor}`);
    if (address.addressDetails.apartment) details.push(`Кв. ${address.addressDetails.apartment}`);
    if (address.addressDetails.domophone) details.push(`Домофон ${address.addressDetails.domophone}`);
    
    return details.length > 0 ? details.join(', ') : null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
            <span className="truncate">Адрес</span>
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {address.isPrimary && (
              <Badge className="bg-blue-500 hover:bg-blue-600">Основной</Badge>
            )}
            {address.isSupportableArea ? (
              <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Обслуживается
              </Badge>
            ) : (
              <Badge className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Заявка
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {/* Основной адрес */}
        {address.address && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Адрес</p>
            <p className="text-sm text-gray-900 break-words">
              {address.address.display || address.address.value}
            </p>
          </div>
        )}

        {/* Детали адреса */}
        {formatAddressDetails() && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Детали</p>
            <p className="text-sm text-gray-600 break-words">{formatAddressDetails()}</p>
          </div>
        )}

        {/* Статус обслуживания */}
        {!address.isSupportableArea && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-orange-800 leading-relaxed">
              Заявка на расширение территории оставлена. Мы рассмотрим вашу заявку и свяжемся с вами.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const UserAddressesList: React.FC = () => {
  const { data: addresses, isLoading, error } = useUserAddresses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Не удалось загрузить адреса. Попробуйте обновить страницу.
        </p>
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600">
          У вас пока нет сохраненных адресов
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Мои адреса</h2>
        <p className="text-sm text-gray-600">
          Всего: {addresses.length}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="w-full">
            <AddressCard address={address} />
          </div>
        ))}
      </div>
    </div>
  );
};
