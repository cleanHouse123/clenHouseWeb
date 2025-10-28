import { Button } from "@/core/components/ui/button/button";
import { Calendar } from "@/core/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/core/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/inputs/select";
import { Textarea } from "@/core/components/ui/inputs/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { TimePicker } from "@/core/components/ui/time-picker";
import { cn } from "@/core/lib/utils";
import AutocompleteAddress from "@/modules/address/ui/autocomplete";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CalendarIcon,
  Clock,
  FileText,
  MapPin,
  StickyNote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScheduleFrequency } from "../types";
import {
  dayOfWeekOptions,
  frequencyOptions,
  needsDaysOfWeek,
  needsPreferredTime,
} from "../utils/scheduleUtils";

const scheduledOrderSchema = z.object({
  address: z.string().min(1, "Адрес обязателен"),
  description: z.string().optional(),
  notes: z.string().optional(),
  frequency: z.nativeEnum(ScheduleFrequency),
  preferredTime: z.string().optional(),
  daysOfWeek: z.array(z.number()).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

type ScheduledOrderFormData = z.infer<typeof scheduledOrderSchema>;

interface ScheduledOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduledOrderFormData) => void;
  isLoading?: boolean;
  editData?: ScheduledOrderFormData;
  title?: string;
}

export const ScheduledOrderModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData,
  title = "Создать расписание",
}: ScheduledOrderModalProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const form = useForm<ScheduledOrderFormData>({
    resolver: zodResolver(scheduledOrderSchema),
    defaultValues: {
      address: "",
      description: "",
      notes: "",
      frequency: ScheduleFrequency.DAILY,
      preferredTime: "",
      daysOfWeek: [],
      startDate: new Date(new Date().setHours(0, 0, 0, 0)), // Сегодня в 00:00
      endDate: undefined,
    },
  });

  const watchedFrequency = form.watch("frequency");

  // Обновляем выбранные дни при изменении частоты
  useEffect(() => {
    if (needsDaysOfWeek(watchedFrequency)) {
      form.setValue("daysOfWeek", selectedDays);
    } else {
      form.setValue("daysOfWeek", []);
      setSelectedDays([]);
    }
  }, [watchedFrequency, form]);

  // Загружаем данные для редактирования
  useEffect(() => {
    if (editData) {
      form.reset(editData);
      if (editData.daysOfWeek) {
        setSelectedDays(editData.daysOfWeek);
      }
    }
  }, [editData, form]);

  const handleSubmit = (data: ScheduledOrderFormData) => {
    onSubmit(data);
  };

  const handleDayToggle = (dayValue: number) => {
    const newSelectedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter((day) => day !== dayValue)
      : [...selectedDays, dayValue];

    setSelectedDays(newSelectedDays);
    form.setValue("daysOfWeek", newSelectedDays);
  };

  const resetForm = () => {
    form.reset();
    setSelectedDays([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] shadow-2xl flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 rounded-t-[24px]">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Clock className="h-5 w-5 text-orange-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Настройте расписание для автоматических заказов
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pr-8 mb-4 custom-scrollbar">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
            {/* Адрес */}
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
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Описание */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Описание заказа
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите, что нужно сделать"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Заметки */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Дополнительные заметки
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Частота */}
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Частота выполнения</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите частоту" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span>{option.label}</span>
                            <span className="text-xs text-gray-500">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Предпочтительное время */}
            {needsPreferredTime(watchedFrequency) && (
              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Предпочтительное время</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Выберите время"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Дни недели */}
            {needsDaysOfWeek(watchedFrequency) && (
              <FormItem>
                <FormLabel>Дни недели</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {dayOfWeekOptions.map((day) => (
                    <Button
                      key={day.value}
                      type="button"
                      variant={
                        selectedDays.includes(day.value) ? "primary" : "outline"
                      }
                      size="sm"
                      onClick={() => handleDayToggle(day.value)}
                      className="min-w-[60px]"
                    >
                      {day.shortLabel}
                    </Button>
                  ))}
                </div>
                {selectedDays.length === 0 && (
                  <p className="text-sm text-red-500">
                    Выберите хотя бы один день
                  </p>
                )}
              </FormItem>
            )}

            {/* Дата начала */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата начала</FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ru })
                          ) : (
                            <span>Выберите дату</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Дата окончания */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата окончания (необязательно)</FormLabel>
                  <Popover
                    open={endCalendarOpen}
                    onOpenChange={setEndCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ru })
                          ) : (
                            <span>Выберите дату окончания</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setEndCalendarOpen(false);
                        }}
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          return (
                            date <
                            (startDate ||
                              new Date(new Date().setHours(0, 0, 0, 0)))
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

              {/* Кнопки */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="rounded-[12px]">
                  Отмена
                </Button>
                <Button type="submit" disabled={isLoading} className="rounded-[12px] bg-orange-500 hover:bg-orange-600">
                  {isLoading ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
