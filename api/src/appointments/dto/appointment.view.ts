import { ApiProperty } from "@nestjs/swagger"
import { Appointment, EAppointmentStatuses, EPaymentMethod } from "../entities/appointment.entity"

class AppointmentCustomerView {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  phoneNumber: string
}

class AppointmentAttendantView {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

class AppointmentServiceView {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  value: number
}

export class AppointmentView {
  constructor(appointment: Appointment) {
    Object.assign(this, appointment)
    this.createdAt = new Date(appointment.createdAt)
    this.onServiceAt = appointment.onServiceAt ? new Date(appointment.onServiceAt) : undefined
    this.finishedAt = appointment.finishedAt ? new Date(appointment.finishedAt) : undefined
  }

  @ApiProperty()
  id: string

  @ApiProperty({ type: AppointmentCustomerView })
  customer: AppointmentCustomerView

  @ApiProperty({ type: AppointmentAttendantView })
  attendant: AppointmentAttendantView

  @ApiProperty({ type: [AppointmentServiceView] })
  services: AppointmentServiceView[]

  @ApiProperty()
  totalPrice: number

  @ApiProperty()
  discount?: number

  @ApiProperty()
  finalPrice: number

  @ApiProperty()
  paymentMethod?: EPaymentMethod

  @ApiProperty()
  redeemCoupon?: string

  @ApiProperty()
  status: EAppointmentStatuses

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  onServiceAt?: Date

  @ApiProperty()
  finishedAt?: Date
}