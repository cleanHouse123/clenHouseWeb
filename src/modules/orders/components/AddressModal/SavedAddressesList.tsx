import React from "react";
import { UserAddress } from "@/modules/address/api";
import { AddressDetails } from "@/modules/orders/types";
import { useUserAddresses } from "@/modules/address/hooks/useAddress";

interface SavedAddressesListProps {
  selectedId: string | null;
  onSelect: (address: UserAddress) => void;
}

const formatAddressDetails = (addressDetails: AddressDetails | null | undefined) => {
  if (!addressDetails) return null;

  const details: string[] = [];
  if (addressDetails.building) details.push(`Дом ${addressDetails.building}`);
  if (addressDetails.buildingBlock)
    details.push(`Корп. ${addressDetails.buildingBlock}`);
  if (addressDetails.entrance) details.push(`Подъезд ${addressDetails.entrance}`);
  if (addressDetails.floor) details.push(`Этаж ${addressDetails.floor}`);
  if (addressDetails.apartment)
    details.push(`Кв. ${addressDetails.apartment}`);
  if (addressDetails.domophone)
    details.push(`Домофон ${addressDetails.domophone}`);

  return details.length ? details.join(", ") : null;
};

export const SavedAddressesList: React.FC<SavedAddressesListProps> = ({
  selectedId,
  onSelect,
}) => {
  const {
    data: addresses,
    isLoading,
    isError,
  } = useUserAddresses();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">Мои адреса</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-16 w-full animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Не удалось загрузить сохраненные адреса. Попробуйте снова.
        </div>
      ) : addresses && addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((userAddress) => {
            const details = formatAddressDetails(userAddress.addressDetails);
            const isSelected = selectedId === userAddress.id;

            if (!userAddress.isSupportableArea) return null;
              
            return (
              <button
                key={userAddress.id}
                type="button"
                onClick={() => onSelect(userAddress)}
                className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-orange-300 hover:shadow-sm transition flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-pressed={isSelected}
              >
                <span
                  className={`mt-1 h-4 w-4 rounded-full border ${
                    isSelected
                      ? "border-orange-500 bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.15)]"
                      : "border-gray-300"
                  }`}
                  aria-hidden
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {userAddress.address?.display || userAddress.address?.value}
                    </p>
                    {userAddress.isSupportableArea ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Обслуживается
                      </span>
                    ) : (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                        Заявка
                      </span>
                    )}
                  </div>
                  {details && (
                    <p className="text-xs text-gray-600 line-clamp-2">{details}</p>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">Нажмите, чтобы выбрать</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          Сохраненные адреса не найдены. Добавьте новый адрес ниже.
        </div>
      )}
    </div>
  );
};
