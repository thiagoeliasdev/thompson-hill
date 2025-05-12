export interface ICustomerView {
  id: string
  name: string
  phoneNumber: string
  profileImage?: string
  birthDate: Date
  createdAt: Date
  gender: EGender

  imageSignedUrl?: string
}

export enum EGender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}