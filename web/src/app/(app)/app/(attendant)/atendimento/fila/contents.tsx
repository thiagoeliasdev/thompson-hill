"use client"

import AttendanceAppointmentCard from "@/components/attendant/appointment-card"
import { useAttendant } from "@/hooks/use-attendant"
import { useQueue } from "@/hooks/useQueue"
import { EPages } from "@/lib/pages.enum"
import { EAppointmentStatuses } from "@/models/appointment"
import { IFirebaseAppointment } from "@/models/firebase-appointment"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

export default function AttendantQueuePageContents({ userId }: { userId: string }) {
  const queue = useQueue()
  const { startAttendance, isStartingAttendance } = useAttendant()
  const router = useRouter()

  const userQueue = useMemo(() => {
    const officialQueue = queue[userId] || []
    if (officialQueue.length > 0) return officialQueue.filter(appointment => appointment.status === EAppointmentStatuses.WAITING || appointment.status === EAppointmentStatuses.ON_SERVICE)

    const generalQueue = queue["fila_geral"] || []
    return generalQueue.filter(appointment => appointment.status === EAppointmentStatuses.WAITING)
  }, [queue, userId])

  async function onAttendanceStart(appointment: IFirebaseAppointment) {
    const response = await startAttendance({
      id: appointment.id,
      attendantId: userId,
    })

    if (response.error) {
      console.error("Error starting attendance:", response.error)
      return
    }
  }

  async function onAttendanceEnd(appointment: IFirebaseAppointment) {
    router.push(`${EPages.ATTENDANCE_CHECKOUT}?appointmentId=${appointment.id}&attendantId=${userId}`)
  }

  console.log("User Queue:", userQueue)

  return (
    <div className="w-full space-y-2">
      {userQueue?.map((appointment, index) => (
        <AttendanceAppointmentCard
          key={appointment.id}
          index={index}
          appointment={appointment}
          onAttendanceStart={onAttendanceStart}
          onAttendanceEnd={onAttendanceEnd}
          isStartingAttendance={isStartingAttendance}
        />
      ))}
    </div>
  )
}
