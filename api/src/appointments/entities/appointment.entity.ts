import { ICustomer } from "src/customers/entities/customer.entity"
import { IService } from "src/services/entities/service.entity"

export enum EPaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  TRANSFER = 'TRANSFER',
  BONUS = 'BONUS',
}

export enum EAppointmentStatuses {
  WAITING = 'WAITING',
  ON_SERVICE = 'ON_SERVICE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface IAppointment {
  id: string
  customer: ICustomer
  attendant?: {
    id: string,
    name: string,
  }
  // services: {
  //   id: string,
  //   name: string,
  //   value: number,
  // }[]
  services: IService[]
  totalPrice: number
  discount?: number
  finalPrice: number
  paymentMethod?: EPaymentMethod
  redeemCoupon?: string
  status: EAppointmentStatuses
  createdAt: Date
  onServiceAt?: Date
  finishedAt?: Date
}

export class Appointment {
  id: string
  customer: {
    id: string,
    name: string,
    phoneNumber: string
  }
  attendant?: {
    id: string,
    name: string,
  }
  services: {
    id: string,
    name: string,
    value: number,
  }[]
  totalPrice: number
  discount?: number
  finalPrice: number
  paymentMethod?: EPaymentMethod
  redeemCoupon?: string
  status: EAppointmentStatuses
  createdAt: Date
  onServiceAt?: Date
  finishedAt?: Date

  constructor(appointment: IAppointment) {
    Object.assign(this, appointment)
    this.createdAt = new Date(appointment.createdAt)
    this.onServiceAt = appointment.onServiceAt ? new Date(appointment.onServiceAt) : undefined
    this.finishedAt = appointment.finishedAt ? new Date(appointment.finishedAt) : undefined
  }
}
