import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./inputs/select";

interface TimePickerProps {
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function TimePicker({ value, onChange, placeholder = "Выберите время", disabled }: TimePickerProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 6 }, (_, i) => (i * 10).toString().padStart(2, '0'));

    const [selectedHour, selectedMinute] = value ? value.split(':') : ['', ''];

    const handleHourChange = (hour: string) => {
        const newTime = `${hour}:${selectedMinute || '00'}`;
        onChange(newTime);
    };

    const handleMinuteChange = (minute: string) => {
        const newTime = `${selectedHour || '00'}:${minute}`;
        onChange(newTime);
    };

    return (
        <div className="flex items-center gap-2 ">
            <Select value={selectedHour} onValueChange={handleHourChange} disabled={disabled}>
                <SelectTrigger className="w-20 bg-white">
                    <SelectValue placeholder="ЧЧ" />
                </SelectTrigger>
                <SelectContent>
                    {hours.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                            {hour}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <span className="text-muted-foreground">:</span>

            <Select value={selectedMinute} onValueChange={handleMinuteChange} disabled={disabled}>
                <SelectTrigger className="w-20 bg-white">
                    <SelectValue placeholder="ММ" />
                </SelectTrigger>
                <SelectContent>
                    {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute}>
                            {minute}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
