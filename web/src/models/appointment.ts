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

export interface IAppointmentView {
  id: string
  customer: {
    id: string
    name: string
    phoneNumber: string
  }
  attendant: {
    id: string
    name: string
  }
  services: {
    id: string
    name: string
    value: number
  }[]
  totalPrice: number
  discount?: number
  finalPrice: number
  paymentMethod: EPaymentMethod
  redeemCoupon?: string
  status: EAppointmentStatuses
  createdAt: Date
  onServiceAt?: Date
  finishedAt?: Date
}