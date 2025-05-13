"use server"

import { getSession } from "@/lib/session"
import { IActionResponse } from "@/models/action-response"
import { CreateCustomerInput, createCustomerSchema } from "./dto/create-customer.input"
import { ICustomerView } from "@/models/customer"
import { EUserRole } from "@/models/user"
import { randomUUID } from "crypto"
import { storage } from "@/lib/firebase"
import axiosClient from "@/lib/axios"

export async function getCustomerByPhoneAction(phoneNumber: string): Promise<IActionResponse<ICustomerView>> {
  const session = await getSession()

  if (session?.user.role !== EUserRole.ADMIN && session?.user.role !== EUserRole.MANAGER && session?.user.role !== EUserRole.TOTEM) {
    return {
      error: "Você não tem permissão para visualizar clientes"
    }
  }

  try {
    const { data } = await axiosClient.get<ICustomerView>(`/customers/phoneNumber/${phoneNumber}`)
    return {
      data
    }
  } catch (err) {
    const error = err as Error
    if (error.message.includes("ECONNREFUSED")) {
      return {
        error: "Servidor não está disponível, tente novamente mais tarde."
      }
    }

    console.error(error)
    return {
      error: error.message
    }
  }
}

export async function createCustomerAction(data: CreateCustomerInput): Promise<IActionResponse<ICustomerView>> {
  const session = await getSession()

  if (session?.user.role !== EUserRole.ADMIN && session?.user.role !== EUserRole.MANAGER && session?.user.role !== EUserRole.TOTEM) {
    return {
      error: "Você não tem permissão para registrar clientes"
    }
  }

  const result = createCustomerSchema.safeParse(data)
  if (!result.success) {
    return {
      error: JSON.stringify(result.error.flatten())
    }
  }

  try {
    // Create a signed URL for the cover image upload if it exists
    let profileImage: string | undefined = undefined
    let imageSignedUrl: string | undefined = undefined

    const uuid = randomUUID()

    if (data.profileImage && data.imageContentType) {
      try {
        const filePath = `services/${uuid}/profile.${data.profileImage.split('.').pop() || 'jpg'}`

        const fileRef = storage.file(filePath)
        const [signedUrl] = await fileRef.getSignedUrl({
          action: 'write',
          expires: Date.now() + 2 * 60 * 1000, // 2 minutes
          contentType: data.imageContentType,
          version: 'v4',
        })
        imageSignedUrl = signedUrl

        // Create a url for the profile image public access
        const encodedPath = encodeURIComponent(filePath)
        profileImage = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${encodedPath}?alt=media`
      } catch (error) {
        console.error("Error generating signed URL:", error)
        throw new Error("Error generating signed URL")
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageContentType, ...dto } = data

    const { data: customer } = await axiosClient.post<ICustomerView>(`/customers`, {
      ...dto,
      profileImage,
    })
    return {
      data: {
        ...customer,
        imageSignedUrl
      }
    }

  } catch (err) {
    const error = err as Error
    if (error.message.includes("ECONNREFUSED")) {
      return {
        error: "Servidor não está disponível, tente novamente mais tarde."
      }
    }

    if (error.message.includes("Customer already exists")) {
      return {
        error: "Cliente já cadastrado"
      }
    }

    console.error(error)
    return {
      error: error.message
    }
  }
}

export async function getCustomersAction(): Promise<IActionResponse<ICustomerView[]>> {
  try {
    const { data } = await axiosClient.get<ICustomerView[]>(`/customers`)
    return { data }

  } catch (err) {
    const error = err as Error
    if (error.message.includes("ECONNREFUSED")) {
      return {
        error: "Servidor não está disponível, tente novamente mais tarde."
      }
    }

    console.error(error)
    return {
      error: error.message
    }
  }
}