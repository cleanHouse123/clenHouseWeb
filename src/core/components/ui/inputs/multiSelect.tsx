import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/core/components/ui/button/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/core/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/core/components/ui/popover";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Выберите элементы...",
    searchPlaceholder = "Поиск...",
    emptyText = "Ничего не найдено.",
    className,
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    const handleRemove = (optionValue: string) => {
        onChange(value.filter((v) => v !== optionValue));
    };

    const selectedOptions = options.filter((option) => value.includes(option.value));

    return (
        <div className={cn("relative", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        <span className="truncate">
                            {selectedOptions.length === 0
                                ? placeholder
                                : selectedOptions.length === 1
                                    ? selectedOptions[0].label
                                    : `${selectedOptions.length} выбрано`}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value.includes(option.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                            <span>{option.label}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemove(option.value)}
                                className="h-auto p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 