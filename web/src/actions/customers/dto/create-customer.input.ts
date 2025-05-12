import { z } from "@/lib/pt-zod"
import { EGender } from "@/models/customer"

export const createCustomerSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  phoneNumber: z.string().min(14, { message: "Telefone inválido" }).max(16, { message: "Telefone inválido" }),
  birthDate: z.string(),
  gender: z.nativeEnum(EGender),
  indicationCode: z.string().optional(),

  profileImage: z.string().optional(),
  imageContentType: z.string().optional()
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>