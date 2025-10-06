import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ru } from "date-fns/locale"
import "react-day-picker/style.css";
import { cn } from "@/core/lib/utils"


export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = ru,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={locale}

      showOutsideDays={showOutsideDays}
      className={cn("p-3 w-full", className)}

      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
