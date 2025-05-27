"use client"

import AppointmentCheckoutForm from "@/components/attendant/appointment-checkout-form"
import { Card, CardContent } from "@/components/ui/card"
import LoadingIndicator from "@/components/ui/loading-indicator"
import { H1 } from "@/components/ui/typography"
import { useAttendant } from "@/hooks/use-attendant"
import { IAppointmentView } from "@/models/appointment"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from 'react'

export default function AttendantCheckoutPage() {
  const { findAttendance, isFindingAttendance, services } = useAttendant()
  const [attendance, setAttendance] = useState<IAppointmentView | null>(null)

  const searchParams = useSearchParams()

  const appointmentId = searchParams.get('appointmentId')
  const attendantId = searchParams.get('attendantId')

  useEffect(() => {
    if (appointmentId && attendantId) {
      findAttendance({ id: appointmentId })
        .then(response => {
          if (response.data) {
            setAttendance(response.data)
          } else {
            console.error('Error fetching attendance:', response.error)
          }
        })
        .catch(error => {
          console.error('Error in useEffect:', error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, attendantId])

  console.log('Attendance:', attendance)

  return (
    <div className="w-full">
      {isFindingAttendance && (
        <div className="flex items-center justify-center h-[90svh] w-full">
          <LoadingIndicator size="2xl" />
        </div>
      )}
      {!isFindingAttendance && attendance && attendantId && (
        <div>
          <H1 className="pb-6">Checkout do Cliente</H1>
          <Card className="pt-0">
            <CardContent>
              <AppointmentCheckoutForm
                attendantId={attendantId}
                appointment={attendance}
                services={services || []}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
