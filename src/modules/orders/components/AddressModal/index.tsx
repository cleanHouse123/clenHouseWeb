import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent } from "@/core/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/inputs/input";
import { Button } from "@/core/components/ui/button/button";
import { MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import AutocompleteAddress from "@/modules/address/ui/autocomplete";
import { Address } from "@/modules/address/types";
import {
  useCheckAddressSupport,
  useCreateUserAddress,
} from "@/modules/address/hooks/useAddress";
import { AddressDetails } from "@/modules/orders/types";
import { UserAddress } from "@/modules/address/api";
import { SavedAddressesList } from "./SavedAddressesList";

const addressSchema = z.object({
  address: z
    .string()
    .min(1, "Адрес обязателен")
    .max(500, "Адрес слишком длинный"),
  building: z.coerce.number().min(1, "Дом должен быть больше 0").optional(),
  buildingBlock: z.string().max(50, "Корпус слишком длинный").optional(),
  entrance: z.string().max(50, "Подъезд слишком длинный").optional(),
  floor: z.coerce.number().min(1, "Этаж должен быть больше 0").optional(),
  apartment: z.coerce
    .number()
    .min(1, "Квартира должна быть больше 0")
    .optional(),
  domophone: z.string().max(50, "Домофон слишком длинный").optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export interface AddressModalData {
  address: string;
  addressId?: string;
  addressDetails?: AddressDetails;
  coordinates?: {
    geo_lat: string;
    geo_lon: string;
  };
  selectedAddress: Address;
}

type Step = "input" | "checking" | "supported" | "unsupported" | "details";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressModalData) => void;
  isLoading?: boolean;
}

const AddressStepHeader = ({ step }: { step: Step }) => (
  <div className="flex-shrink-0 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 px-4 sm:px-6 py-4 sm:py-6 rounded-t-[24px]">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-[12px] flex items-center justify-center flex-shrink-0">
        <MapPin className="h-4 w-4 sm:h-5 text-white" />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {step === "unsupported" ? "Адрес вне зоны обслуживания" : "Проверка адреса"}
        </h2>
        <p className="text-sm text-gray-600">
          {step === "unsupported"
            ? "Выберите другой адрес, чтобы продолжить"
            : "Укажите адрес для проверки доступности доставки"}
        </p>
      </div>
    </div>
  </div>
);

const AddressInputField = ({
  form,
  selectedAddress,
  step,
  onSelect,
  onResetStep,
}: {
  form: ReturnType<typeof useForm<AddressFormData>>;
  selectedAddress: Address | null;
  step: Step;
  onSelect: (address: Address | null) => void;
  onResetStep: () => void;
}) => (
  <FormField
    control={form.control}
    name="address"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Адрес
        </FormLabel>
        <FormControl>
          <AutocompleteAddress
            value={field.value}
            onChange={(value) => {
              if (selectedAddress && selectedAddress.display !== value) {
                onSelect(null);
              }
              field.onChange(value);
              if (step !== "input") {
                onResetStep();
              }
            }}
            onAddressSelect={onSelect}
          />
        </FormControl>
        <FormMessage />
        {step === "unsupported" && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Мы пока не обслуживаем этот адрес. Попробуйте другой.</span>
          </div>
        )}
        {step === "details" && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Адрес доступен для доставки. Заполните детали.</span>
          </div>
        )}
      </FormItem>
    )}
  />
);

const AddressDetailsFields = ({
  form,
}: {
  form: ReturnType<typeof useForm<AddressFormData>>;
}) => (
  <div className="space-y-4">
    <h3 className="text-base font-semibold text-gray-900">Детали адреса</h3>
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {[
        { name: "building", label: "Дом", type: "number", numeric: true },
        { name: "buildingBlock", label: "Корпус" },
        { name: "entrance", label: "Подъезд" },
        { name: "floor", label: "Этаж", type: "number", numeric: true },
        { name: "apartment", label: "Квартира", type: "number", numeric: true },
        { name: "domophone", label: "Домофон" },
      ].map((fieldConfig) => (
        <FormField
          key={fieldConfig.name}
          control={form.control}
          name={fieldConfig.name as keyof AddressFormData}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{fieldConfig.label}</FormLabel>
              <FormControl>
                <Input
                  type={fieldConfig.type || "text"}
                  placeholder={fieldConfig.label}
                  className="w-full rounded-lg"
                  {...field}
                  value={fieldConfig.numeric ? field.value || "" : field.value}
                  onChange={(e) =>
                    field.onChange(
                      fieldConfig.numeric
                        ? e.target.value
                          ? Number(e.target.value)
                          : ""
                        : e.target.value,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  </div>
);

const UnsupportedActions = ({
  isCreating,
  onRestart,
  onRequest,
}: {
  isCreating: boolean;
  onRestart: () => void;
  onRequest: () => void;
}) => (
  <div className="space-y-4 pt-4">
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p className="text-sm text-blue-800 mb-3">
        Вы можете оставить заявку на расширение территории обслуживания до этого адреса.
        Мы рассмотрим вашу заявку и свяжемся с вами.
      </p>
      <div className="flex gap-3 justify-end flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={onRestart}
          disabled={isCreating}
          className="min-w-[160px]"
        >
          Выбрать другой адрес
        </Button>
        <Button
          type="button"
          onClick={onRequest}
          disabled={isCreating}
          className="min-w-[240px]"
        >
          {isCreating ? "Сохраняем..." : "Оставить заявку на расширение территории"}
        </Button>
      </div>
    </div>
  </div>
);

const ActionsAfterCheck = ({
  isLoading,
  isSaving,
  onRestart,
}: {
  isLoading: boolean;
  isSaving: boolean;
  onRestart: () => void;
}) => (
  <div className="flex justify-end gap-3 pt-4">
    <Button
      type="button"
      variant="outline"
      onClick={onRestart}
      disabled={isLoading}
    >
      Изменить адрес
    </Button>
    <Button
      type="submit"
      disabled={isLoading || isSaving}
      className="min-w-[120px]"
    >
      {isLoading || isSaving ? "Сохраняем..." : "Продолжить"}
    </Button>
  </div>
);

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(
    null,
  );
  const [isAddressSupported, setIsAddressSupported] = useState<boolean>(false);
  const [step, setStep] = useState<Step>("input");
  const { mutateAsync: checkAddressSupport, isPending: isCheckingSupport } =
    useCheckAddressSupport();
  const { mutateAsync: createUserAddress, isPending: isCreatingAddress } =
    useCreateUserAddress();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
      building: undefined,
      buildingBlock: "",
      entrance: "",
      floor: undefined,
      apartment: undefined,
      domophone: "",
    },
  });

  // Сброс при закрытии
  useEffect(() => {
    if (!isOpen) {
      setStep("input");
      setSelectedAddress(null);
      setSelectedSavedAddressId(null);
      setIsAddressSupported(false);
      form.reset();
    }
  }, [isOpen, form]);

  const handleAddressSelect = (address: Address | null) => {
    setSelectedAddress(address);
    setSelectedSavedAddressId(null);
    if (!address) return;

    form.setValue("address", address.display);

    // Если в адресе уже есть номер дома, заполняем поле building
    if (address.house) {
      const houseNumber = parseInt(address.house);
      if (!isNaN(houseNumber)) {
        form.setValue("building", houseNumber);
      }
    }
  };

  const handleCheckAddress = async () => {
    if (!selectedAddress) {
      form.setError("address", { message: "Выберите адрес из подсказок" });
      return;
    }

    setStep("checking");
    try {
      const supported = await checkAddressSupport(selectedAddress);
      setIsAddressSupported(supported);
      if (supported) {
        setStep("details");
      } else {
        setStep("unsupported");
      }
    } catch (error) {
      console.error("Address check failed", error);
      form.setError("address", {
        message: "Не удалось проверить адрес. Повторите попытку.",
      });
      setStep("input");
    }
  };

  const handleSubmit = async (data: AddressFormData) => {
    if (!selectedAddress) return;

    const coordinates =
      selectedAddress.geo_lat && selectedAddress.geo_lon
        ? {
            geo_lat: selectedAddress.geo_lat,
            geo_lon: selectedAddress.geo_lon,
          }
        : undefined;

    const addressDetails: AddressDetails = {};
    const hasHouseInSelected = !!selectedAddress.house;

    if (data.building && !hasHouseInSelected)
      addressDetails.building = data.building;
    if (data.buildingBlock) addressDetails.buildingBlock = data.buildingBlock;
    if (data.entrance) addressDetails.entrance = data.entrance;
    if (data.floor) addressDetails.floor = data.floor;
    if (data.apartment) addressDetails.apartment = data.apartment;
    if (data.domophone) addressDetails.domophone = data.domophone;

    const hasAddressDetails = Object.keys(addressDetails).length > 0;

    // Привязываем адрес к пользователю
    let createdAddressId: string | undefined;
    try {
      const createdAddress = await createUserAddress({
        address: selectedAddress,
        ...(hasAddressDetails && { addressDetails }),
        isSupportableArea: isAddressSupported,
        isPrimary: false,
      });
      createdAddressId = createdAddress.id;
    } catch (error) {
      console.error("Failed to create user address", error);
      // Продолжаем выполнение даже если не удалось сохранить адрес
    }

    onSubmit({
      address: data.address,
      ...(createdAddressId && { addressId: createdAddressId }),
      ...(hasAddressDetails && { addressDetails }),
      coordinates,
      selectedAddress,
    });
  };

  const handleRestart = () => {
    setStep("input");
    setSelectedAddress(null);
    setSelectedSavedAddressId(null);
    setIsAddressSupported(false);
    form.reset();
  };

  const handleRequestExpansion = async () => {
    if (!selectedAddress) return;

    const addressDetails: AddressDetails = {};
    const formData = form.getValues();
    const hasHouseInSelected = !!selectedAddress.house;

    if (formData.building && !hasHouseInSelected)
      addressDetails.building = formData.building;
    if (formData.buildingBlock)
      addressDetails.buildingBlock = formData.buildingBlock;
    if (formData.entrance) addressDetails.entrance = formData.entrance;
    if (formData.floor) addressDetails.floor = formData.floor;
    if (formData.apartment) addressDetails.apartment = formData.apartment;
    if (formData.domophone) addressDetails.domophone = formData.domophone;

    const hasAddressDetails = Object.keys(addressDetails).length > 0;

    try {
      await createUserAddress({
        address: selectedAddress,
        ...(hasAddressDetails && { addressDetails }),
        isSupportableArea: false, // Адрес не поддерживается
        isPrimary: false,
      });

      // Возвращаем на этап выбора адреса
      handleRestart();
    } catch (error) {
      console.error("Failed to save address request", error);
      form.setError("address", {
        message: "Не удалось сохранить заявку. Попробуйте еще раз.",
      });
    }
  };

  const handleSelectSavedAddress = (userAddress: UserAddress) => {
    if (!userAddress.address) return;

    const coordinates =
      userAddress.address.geo_lat && userAddress.address.geo_lon
        ? {
            geo_lat: userAddress.address.geo_lat,
            geo_lon: userAddress.address.geo_lon,
          }
        : undefined;

    setSelectedSavedAddressId(userAddress.id);

    onSubmit({
      address: userAddress.address.display || userAddress.address.value,
      addressId: userAddress.id,
      ...(userAddress.addressDetails && {
        addressDetails: userAddress.addressDetails,
      }),
      ...(coordinates && { coordinates }),
      selectedAddress: userAddress.address,
    });

    handleClose();
  };

  const handleClose = () => {
    setStep("input");
    setSelectedAddress(null);
    setSelectedSavedAddressId(null);
    setIsAddressSupported(false);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[85vh] sm:max-h-[95vh] p-0 gap-0 shadow-2xl flex flex-col overflow-x-hidden">
        <AddressStepHeader step={step} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 pr-8 pb-4 mb-4 custom-scrollbar">
          <div className="space-y-6">
            <SavedAddressesList
              selectedId={selectedSavedAddressId}
              onSelect={handleSelectSavedAddress}
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
              <AddressInputField
                form={form}
                selectedAddress={selectedAddress}
                step={step}
                onSelect={handleAddressSelect}
                onResetStep={() => setStep("input")}
              />

              <AddressDetailsFields form={form} />
              {selectedAddress && (step === "input" || step === "checking") && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleCheckAddress}
                    disabled={isCheckingSupport || isLoading}
                    className="min-w-[160px]"
                  >
                    {isCheckingSupport ? "Проверяем..." : "Проверить адрес"}
                  </Button>
                </div>
              )}

              {step === "details" && (
                <ActionsAfterCheck
                  isLoading={isLoading}
                  isSaving={isCreatingAddress}
                  onRestart={handleRestart}
                />
              )}

              {step === "unsupported" && (
                <UnsupportedActions
                  isCreating={isCreatingAddress}
                  onRestart={handleRestart}
                  onRequest={handleRequestExpansion}
                />
              )}
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
