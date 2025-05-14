"use client"

import { H1 } from "@/components/ui/typography"
import { useAdmin } from "@/hooks/use-admin"
import { Card, CardContent } from "@/components/ui/card"
import AppointmentsTable from "@/components/admin/appointments-table"

export default function AppointmentsPage() {
  const { appointments, isLoadingAppointments } = useAdmin()

  return (
    <div className="w-full flex flex-col max-w-[1440px] mx-auto">
      <H1>Agendamentos</H1>
      <Card className="mt-2">
        <CardContent>
          <AppointmentsTable
            data={appointments}
            isLoading={isLoadingAppointments}
            emptyMessage="Nenhum agendamento encontrado"
          />
        </CardContent>
      </Card>
    </div>
  )
}
