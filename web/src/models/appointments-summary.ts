export interface IAppointmentSummaryView {
  attendantName: string
  attendantId: string
  totalAppointments: number
  totalServiceWeight: number
  totalPrice: number
  totalDiscount: number
  totalFinalPrice: number
  totalPaymentFee: number
  firstAppointmentDate: Date | null | undefined
  lastAppointmentDate: Date | null | undefined
  totalAttendanceMinutes: number | null
  meanAttendanceTimeByServicesInMinutes: number | null
  finalServicesPrice: number
  finalProductsPrice: number
}