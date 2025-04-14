"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimeFieldProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimeField({ value, onChange, className }: TimeFieldProps) {
  const [open, setOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }

  const handleBlur = () => {
    onChange(localValue)
  }

  const timeOptions = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ]

  const selectTime = (time: string) => {
    onChange(time)
    setLocalValue(time)
    setOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Select time"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setOpen(true)}
            >
              <Clock className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-3 gap-2">
            {timeOptions.map((time) => (
              <Button
                key={time}
                variant="outline"
                size="sm"
                onClick={() => selectTime(time)}
                className={cn(
                  "text-center",
                  localValue === time && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {time}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
