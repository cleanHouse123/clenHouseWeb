import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useEffect, useState } from "react";

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

  console.log(addresses?.length);


  return (

      <Autocomplete
        selectedKey={selectedKey}
        inputValue={inputValue}
        onSelectionChange={handleSelectionChange}
        onInputChange={handleInputChange}
        placeholder="Введите адрес для поиска"
        className="flex w-full flex-wrap md:flex-nowrap gap-4 border border-gray-200 rounded-md p-2"


      >
        {isLoading || !addresses?.length ? (
          <AutocompleteItem
            key="loading"
            className="px-4 py-3 text-gray-600 bg-gray-50"
          >
            {isLoading ? "Поиск адресов..." : "Адреса не найдены"}
          </AutocompleteItem>
        ) : (
          addresses.map((address) => (
            <AutocompleteItem
              key={address.display}
              style={{
                width: "100%",
                pointerEvents: "auto",
                backgroundColor: "hsl(240 5% 24%)",
                position: "relative",
                zIndex: 1000,
              }}
            >
              {address.display}
            </AutocompleteItem>
          ))
        )}
      </Autocomplete>
  );
}
