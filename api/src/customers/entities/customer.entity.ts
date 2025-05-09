export enum ECustomerGender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export interface ICustomer {
  id: string
  name: string
  phoneNumber: string
  profileImage?: string
  birthDate: Date
  gender: ECustomerGender
  createdAt: Date
}

export class Customer {
  id: string
  name: string
  phoneNumber: string
  profileImage?: string
  birthDate: Date
  gender: ECustomerGender
  createdAt: Date

  constructor(data: ICustomer) {
    Object.assign(this, data)
    this.createdAt = new Date(data.createdAt)
    this.birthDate = new Date(data.birthDate)
  }
}