"use client"

import { z } from "@/lib/pt-zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon, SearchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EAppointmentStatuses, EAppointmentStatusesMapper, EPaymentMethod } from "@/models/appointment"
import { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { addHours, format, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { DateRange } from "react-day-picker"

enum ESortOrder {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

enum ESortOptions {
  CUSTOMER_NAME = "customer.name",
  ATTENDANT_NAME = "attendant.name",
  STATUS = "status",
  CREATED_AT = "createdAt",
}

const ESortOrderMapper: Record<ESortOrder, string> = {
  [ESortOrder.ASCENDING]: "Crescente",
  [ESortOrder.DESCENDING]: "Decrescente",
}

const ESortOptionsMapper: Record<ESortOptions, string> = {
  [ESortOptions.CUSTOMER_NAME]: "Nome do Cliente",
  [ESortOptions.ATTENDANT_NAME]: "Nome do Atendente",
  [ESortOptions.STATUS]: "Status",
  [ESortOptions.CREATED_AT]: "Data",
}

const formSchema = z.object({
  customerName: z.string().optional(),
  paymentMethod: z.nativeEnum(EPaymentMethod).optional(),
  status: z.nativeEnum(EAppointmentStatuses).optional(),
  order: z.nativeEnum(ESortOrder).optional(),
  sortBy: z.nativeEnum(ESortOptions).optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
})

export type AppointmentSearchFormSchema = z.infer<typeof formSchema>

interface Props {
  onSubmit: (values: z.infer<typeof formSchema>) => void
  className?: ClassNameValue
}

export default function AppointmentSearchForm({ onSubmit, className }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: undefined,
      paymentMethod: undefined,
      status: undefined,
      order: ESortOrder.DESCENDING,
      sortBy: ESortOptions.CREATED_AT,
      fromDate: undefined,
      toDate: undefined,
    },
  })
  const [date, setDate] = useState<DateRange | undefined>(undefined)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values => {
          const formattedValues = {
            ...values,
            fromDate: date?.from ? addHours(startOfDay(date.from), 6) : undefined,
            toDate: date?.to ? addHours(startOfDay(date.to), 6) : undefined,
          }
          // setDate({ from: formattedValues.from, to: formattedValues.to })
          console.log("Formatted Values:", formattedValues)
          onSubmit(formattedValues)
        }))}
        className={cn("w-full pt-6 flex flex-col flex-wrap lg:flex-nowrap gap-4 justify-between items-start", className)}>
        <div className="*:not-first:mt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                <span
                  className={cn("truncate", !date && "text-muted-foreground")}
                >
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd LLL y", { locale: ptBR })} -{" "}
                        {format(date.to, "dd LLL y", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "dd LLL y", { locale: ptBR })
                    )
                  ) : (
                    "Selecione um intervalo de datas"
                  )}
                </span>
                <CalendarIcon
                  size={16}
                  className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full flex flex-col flex-wrap lg:flex-nowrap lg:flex-row gap-4 justify-between items-end">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem className="w-full sm:w-full">
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Digite..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full sm:w-full">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(EAppointmentStatuses).map((item) => (
                      <SelectItem key={item} value={item}>{EAppointmentStatusesMapper[item].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sortBy"
            render={({ field }) => (
              <FormItem className="w-full sm:w-full">
                <FormLabel>Ordenar por</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ESortOptions).map((item) => (
                      <SelectItem key={item} value={item}>{ESortOptionsMapper[item]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem className="w-full sm:w-full">
                <FormLabel>Direção</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full sm:w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ESortOrder).map((item) => (
                      <SelectItem key={item} value={item}>{ESortOrderMapper[item]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            isLoading={form.formState.isSubmitting}
            type="submit"
            className="h-10 lg:h-14"
          ><SearchIcon /></Button>
        </div>
      </form>
    </Form>
  )
}
