"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { H1 } from "@/components/ui/typography"
import { useAdmin } from "@/hooks/use-admin"
import { useQueue } from "@/hooks/useQueue"
import { cn } from "@/lib/utils"
import { EAppointmentStatusesMapper } from "@/models/appointment"
import { EUserRole, EUserStatus } from "@/models/user"
import { format } from "date-fns"
import { useMemo } from "react"

export default function AdminDashboardPage() {
  const queue = useQueue()
  const { users } = useAdmin()

  const activeAttendants = useMemo(() => {
    return users?.filter((user) => user.role === EUserRole.ATTENDANT && user.status === EUserStatus.ACTIVE)
  }, [users])

  return (
    <div className="w-full flex flex-col max-w-[1440px] mx-auto">
      <H1>Filas de Atendimento</H1>

      <ScrollArea className="w-[calc(100vw-6rem)]">
        <div className="flex flex-row gap-1 pb-4">
          {activeAttendants?.map((attendant) => (
            <Card key={attendant.id} className="min-w-64 max-w-64">
              <CardHeader className="px-3">
                <CardTitle className="text-primary capitalize text-xl font-bold">{attendant.name}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 space-y-1">
                {queue[queue[attendant.userName]?.length > 0 ? attendant.userName : "fila_geral"]?.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-input/10 flex flex-col gap-1 border border-input rounded-xl p-2"
                  >
                    <div className="flex items-center justify-between">
                      <p>{format(new Date(appointment.createdAt || ""), "HH:mm")}</p>
                      <p
                        className="text-sm py-0.5 px-2 rounded-r-full rounded-l-full"
                        style={{
                          backgroundColor: EAppointmentStatusesMapper[appointment.status].bgColor,
                          color: EAppointmentStatusesMapper[appointment.status].textColor,
                        }}
                      >{EAppointmentStatusesMapper[appointment.status].label}</p>
                      <p className={cn("text-sm font-semibold", appointment.attendant ? "text-transparent" : "text-primary")}>Fila Geral</p>
                    </div>
                    <h3 className="font-bold text-lg">{appointment.customer?.name}</h3>
                    <h4 className="text-sm text-muted-foreground">{appointment.services?.[0].name}</h4>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
