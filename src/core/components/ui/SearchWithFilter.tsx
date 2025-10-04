import React, { ChangeEvent, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Button } from "@/core/components/ui/button/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/inputs/select";

interface SortOption {
  value: string;
  label: string;
}

interface SearchWithFilterProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  sortOptions?: SortOption[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
  className?: string;
  showSortButton?: boolean;
  handleResetFilters?: () => void;
}

export const SearchWithFilter = ({
  placeholder,
  value,
  onChange,
  sortOptions = [],
  currentSort,
  onSortChange,
  className = "",
  showSortButton = true,
  handleResetFilters,
}: SearchWithFilterProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSortChange = (optionValue: string) => {
    onSortChange?.(optionValue);
  };

  return (
    <>
      <div className={`flex gap-3 ${className}`}>
        <div className="relative flex-none w-[373px]">
          <Search className="absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground left-3" />
          <input
            type="text"
            placeholder={placeholder || "Поиск..."}
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value)
            }
            className="w-full py-2 bg-background border border-input text-foreground placeholder:text-muted-foreground rounded h-10 outline-none focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring pl-10 pr-4"
          />
        </div>

        {showSortButton && (
          <Popover open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Фильтр
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Сортировка</h4>
                  <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите сортировку" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {handleResetFilters && (
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="w-full"
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </>
  );
};
