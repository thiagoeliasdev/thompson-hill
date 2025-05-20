import { z } from "@/lib/pt-zod"
import { isDateValid } from "@/lib/utils"
import { EGender } from "@/models/customer"
import { differenceInYears, isAfter } from "date-fns"

export const updateCustomerSchema = z.object({
  name: z.string().nonempty("Nome é não pode estar vazio").optional(),
  phoneNumber: z.string().min(13, { message: "Telefone inválido" }).max(16, { message: "Telefone inválido" }),
  birthDate: z.string()
    .refine(value => isDateValid(value), { message: "Data inválida" })
    .refine(value => isAfter(new Date(), new Date(value)), { message: "Valor não pode ser maior do que a data atual" })
    .refine(value => differenceInYears(new Date(), new Date(value)) <= 120, { message: "Data inválida" }),
  gender: z.nativeEnum(EGender).optional(),
  indicationCode: z.string().optional(),

  profileImage: z.string().optional(),
  imageContentType: z.string().optional()
})

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>