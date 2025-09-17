import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useAddresses } from "../../hooks/useOrders";

interface AutocompleteAddressProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function AutocompleteAddress({
  onChange,
  value,
}: AutocompleteAddressProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const { data: addresses, isLoading } = useAddresses(inputValue || "");

  useEffect(() => {
    setInputValue(value || "");
    if (!value) {
      setSelectedKey(null);
    }
  }, [value]);

  const handleSelectionChange = (key: React.Key | null) => {
    const keyString = key?.toString() || null;
    setSelectedKey(keyString);

    if (keyString && onChange) {
      onChange(keyString);
    } else if (!keyString && onChange) {
      // Если выбор сброшен, очищаем значение
      onChange("");
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Если инпут очищен, сбрасываем выбранный ключ
    if (value === "") {
      setSelectedKey(null);
    }

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="w-full">
      <Autocomplete
        selectedKey={selectedKey}
        inputValue={inputValue}
        onSelectionChange={handleSelectionChange}
        onInputChange={handleInputChange}
        placeholder="Введите адрес для поиска"
        className="w-full"
        classNames={{
          base: "w-full",
          inputWrapper: "border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200",
          input: "text-gray-900 placeholder:text-gray-500",
          listbox: "border border-gray-200 rounded-lg shadow-lg mt-1 bg-gray-50",
          popoverContent: "p-0 bg-gray-50"
        }}
      >
        {isLoading || !addresses?.length ? (
          <AutocompleteItem
            key="loading"
            className="px-4 py-3 text-gray-600 bg-gray-50"
          >
            {isLoading ? "Поиск адресов..." : "Адреса не найдены"}
          </AutocompleteItem>
        ) : (
          addresses?.map((address) => (
            <AutocompleteItem
              key={address.value}
              className="px-4 py-3 hover:bg-blue-100 cursor-pointer transition-colors duration-150 bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-gray-800">{address.value}</span>
              </div>
            </AutocompleteItem>
          ))
        )}
      </Autocomplete>
    </div>
  );
}
