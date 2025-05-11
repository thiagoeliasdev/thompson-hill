import { faker } from '@faker-js/faker'
import { CreateUserInput } from "../dto/create-user.input"
import { EUserRole, EUserStatus } from "../entities/user.entity"

export function getRandomUserData(data?: Partial<CreateUserInput>): CreateUserInput {
  return {
    name: data?.name || faker.person.fullName(),
    userName: data?.userName || faker.internet.username(),
    password: data?.password || faker.internet.password({ length: 12 }),
    role: data?.role || faker.helpers.enumValue(EUserRole),
    status: data?.status || faker.helpers.enumValue(EUserStatus),
    profileImage: data?.profileImage || faker.image.urlPicsumPhotos(),
  }
}