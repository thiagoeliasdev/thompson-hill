"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { H1 } from "@/components/ui/typography"
import { useQueue } from "@/hooks/useQueue"
import { format } from "date-fns"

export default function AdminDashboardPage() {
  const queue = useQueue()

  console.log(queue)

  return (
    <div className="w-full flex flex-col max-w-[1440px] mx-auto">
      <H1>Filas de Atendimento</H1>

      <div className="w-full flex flex-row gap-4 flex-nowrap overflow-x-scroll">
        {Object.entries(queue).map(([attendantUserName, appointments]) => (
          <Card key={attendantUserName} className="min-w-72 max-w-72">
            <CardHeader>
              <CardTitle>{attendantUserName}</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-2 border-b border-b-slate-200 py-2"
                >
                  <div className="flex items-center justify-between">
                    <p>{format(new Date(appointment.createdAt || ""), "HH:mm")}</p>
                    <p>{appointment.status}</p>
                    <p>{appointment.attendant ? "" : "Fila Geral"}</p>
                  </div>
                  <h3>{appointment.customer?.name}</h3>
                  <h4>{appointment.services?.[0].name}</h4>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
