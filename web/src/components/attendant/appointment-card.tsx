"use client"

import { IFirebaseAppointment } from "@/models/firebase-appointment"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { H2 } from "../ui/typography"
import { format } from "date-fns"
import { Button } from "../ui/button"
import { CircleCheckBigIcon, PlayIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { EAppointmentStatuses } from "@/models/appointment"
import Image from "next/image"
import { images } from "@/lib/images"

interface IAppointmentCardProps {
  index: number
  appointment: IFirebaseAppointment
  onAttendanceStart: (appointment: IFirebaseAppointment) => void
  onAttendanceEnd: (appointment: IFirebaseAppointment) => void
  isStartingAttendance: boolean
}

export default function AttendanceAppointmentCard({ index, appointment, onAttendanceStart, isStartingAttendance, onAttendanceEnd }: IAppointmentCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="w-full flex items-center justify-between">
          <p className={cn("text-primary font-semibold", index === 0 ? "text-primary" : "text-transparent")}>{appointment.status === EAppointmentStatuses.WAITING ? "Próximo Cliente" : "Atendendo"}</p>
          <p className={cn("text-sm font-semibold", appointment.attendant ? "text-transparent" : "text-primary")}>Fila Geral</p>
        </div>
        <H2 className={cn("text-center pb-4", index === 0 && "text-3xl")}>{appointment.customer.name}</H2>
        <Image
          src={appointment.customer.profileImage || images.userPlaceholder}
          alt={appointment.customer.name || "Foto do Cliente"}
          width={100}
          height={100}
          className="mx-auto size-52 aspect-square object-cover"
        />
      </CardHeader>
      <CardContent>
        {appointment.services.map((service) => (
          <p key={service.id} className="text-2xl text-muted-foreground">
            - <strong className="text-foreground">{service.name}</strong>
          </p>
        ))}
        <p className="text-base text-muted-foreground">Entrada as <strong className="text-foreground">{format(new Date(appointment.createdAt), "hh:mm")}</strong></p>
        {appointment.onServiceAt && (
          <p className="text-base text-muted-foreground">Atendimento iniciado as <strong className="text-foreground">{format(new Date(appointment.onServiceAt), "hh:mm")}</strong></p>
        )}
      </CardContent>
      {index === 0 && (
        <CardFooter className="w-full flex justify-start items-end gap-2">
          {appointment.status === EAppointmentStatuses.WAITING && (
            <Button
              size="lg"
              className="flex-1"
              isLoading={isStartingAttendance}
              onClick={() => onAttendanceStart(appointment)}
            >
              <PlayIcon className="size-6" />
              Iniciar Atendimento
            </Button>
          )}
          {appointment.status === EAppointmentStatuses.ON_SERVICE && (
            <Button
              size="lg"
              variant="destructive"
              className="flex-1"
              isLoading={isStartingAttendance}
              onClick={() => onAttendanceEnd(appointment)}
            >
              <CircleCheckBigIcon className="size-6" />
              Encerrar Atendimento
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
