import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./inputs/select";

interface TimePickerProps {
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minTime?: string;
    maxTime?: string;
}

export function TimePicker({
    value,
    onChange,
    placeholder = "Выберите время",
    disabled,
    minTime,
    maxTime
}: TimePickerProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 6 }, (_, i) => (i * 10).toString().padStart(2, '0'));

    const [selectedHour, selectedMinute] = value ? value.split(':') : ['', ''];

    const [minHour, minMinute] = minTime ? minTime.split(':').map((part) => parseInt(part, 10)) : [null, null];
    const [maxHour, maxMinute] = maxTime ? maxTime.split(':').map((part) => parseInt(part, 10)) : [null, null];

    const isHourDisabled = (hour: number) => {
        if (minHour !== null && hour < minHour) return true;
        if (maxHour !== null && hour > maxHour) return true;
        return false;
    };

    const getAllowedMinutes = (hour: string) => {
        const hourNumber = parseInt(hour, 10);
        return minutes.filter((minute) => {
            const minuteNumber = parseInt(minute, 10);
            if (minHour !== null && hourNumber === minHour && minMinute !== null && minuteNumber < minMinute) return false;
            if (maxHour !== null && hourNumber === maxHour && maxMinute !== null && minuteNumber > maxMinute) return false;
            return true;
        });
    };

    const handleHourChange = (hour: string) => {
        const allowedMinutes = getAllowedMinutes(hour);
        const nextMinute = allowedMinutes.includes(selectedMinute) ? selectedMinute : allowedMinutes[0] || '00';
        const newTime = `${hour}:${nextMinute}`;
        onChange(newTime);
    };

    const handleMinuteChange = (minute: string) => {
        const hour = selectedHour || (minHour !== null ? String(minHour).padStart(2, '0') : '00');
        const allowedMinutes = getAllowedMinutes(hour);
        const clampedMinute = allowedMinutes.includes(minute) ? minute : allowedMinutes[0] || minute;
        const newTime = `${hour}:${clampedMinute}`;
        onChange(newTime);
    };

    const availableHours = hours.filter((hour) => !isHourDisabled(parseInt(hour, 10)));
    const availableMinutes = selectedHour ? getAllowedMinutes(selectedHour) : minutes;

    return (
        <div className="flex items-center gap-2 ">
            <Select value={selectedHour} onValueChange={handleHourChange} disabled={disabled}>
                <SelectTrigger className="w-20 bg-white">
                    <SelectValue placeholder="ЧЧ" />
                </SelectTrigger>
                <SelectContent>
                    {availableHours.map((hour) => (
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
                    {availableMinutes.map((minute) => (
                        <SelectItem
                            key={minute}
                            value={minute}
                        >
                            {minute}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
