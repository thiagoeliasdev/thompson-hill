"use client"

import { H1 } from "@/components/ui/typography"
import { useAdmin } from "@/hooks/use-admin"
import { Card, CardContent } from "@/components/ui/card"
import AppointmentsTable from "@/components/admin/appointments-table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMemo, useState } from "react"
import { IAppointmentView } from "@/models/appointment"
import AppointmentUpdateForm from "@/components/admin/appointment-update-form"
import { EUserRole } from "@/models/user"

export default function AppointmentsPage() {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointmentView | undefined>(undefined)
  const { appointments, isLoadingAppointments, users, isLoadingUsers, services, isLoadingServices } = useAdmin()

  const attendants = useMemo(() => {
    return users?.filter(user => user.role === EUserRole.ATTENDANT)
  }, [users])

  return (
    <div className="w-full flex flex-col max-w-[1440px] mx-auto">
      <H1>Atendimentos</H1>

      <Sheet
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Atualizar Atendimento</SheetTitle>
            <SheetDescription>
              Atualize as informações do atendimento
            </SheetDescription>
          </SheetHeader>
          <AppointmentUpdateForm
            appointment={selectedAppointment!}
            attendants={attendants || []}
            services={services || []}
            isLoading={isLoadingAppointments || isLoadingUsers || isLoadingServices}
            onSuccess={() => {
              setSheetOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      <Card className="mt-2">
        <CardContent>
          <AppointmentsTable
            data={appointments}
            isLoading={isLoadingAppointments}
            emptyMessage="Nenhum atendimento encontrado"
            onEditButtonClick={(appointment) => {
              setSelectedAppointment(appointment)
              setSheetOpen(true)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
