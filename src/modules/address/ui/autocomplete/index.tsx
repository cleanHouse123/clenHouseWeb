import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useAddresses } from "../../hooks/useOrders";

interface AutocompleteAddressProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function AutocompleteAddress({
  onChange,
  value,
}: AutocompleteAddressProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: addresses, isLoading } = useAddresses(debouncedValue);

  // Дебаунс для запросов
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node) &&
        inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);

    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleAddressSelect = useCallback((address: string) => {
    setInputValue(address);
    setIsOpen(false);

    if (onChange) {
      onChange(address);
    }
  }, [onChange]);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Введите адрес для поиска"
          className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-0 focus:border-gray-300"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-gray-600 bg-gray-50">
              Поиск адресов...
            </div>
          ) : !addresses?.length ? (
            <div className="px-4 py-3 text-gray-600 bg-gray-50">
              Адреса не найдены
            </div>
          ) : (
            addresses.map((address, index) => (
              <div
                key={`${address.display}-${index}`}
                onClick={() => handleAddressSelect(address.display)}
                className="px-4 py-3 text-gray-800 bg-white hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors"
              >
                {address.display}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}