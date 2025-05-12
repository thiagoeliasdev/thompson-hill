"use server"

import { IServiceView } from "@/models/service"
import { CreateServiceInput, createServiceSchema } from "./dto/create-service.input"
import { IActionResponse } from "@/models/action-response"
import { getSession } from "@/lib/session"
import { EUserRole } from "@/models/user"
import { randomUUID } from "crypto"
import { storage } from "@/lib/firebase"
import axiosClient from "@/lib/axios"
import { UpdateServiceInput, updateServiceSchema } from "./dto/update-service.input"
import { revalidatePath } from "next/cache"
import { EPages } from "@/lib/pages.enum"

export async function getServicesAction(): Promise<IActionResponse<IServiceView[]>> {
  try {
    const { data } = await axiosClient.get<IServiceView[]>(`/services`)
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

export async function createServiceAction(data: CreateServiceInput): Promise<IActionResponse<IServiceView>> {
  const session = await getSession()

  if (session?.user.role !== EUserRole.ADMIN && session?.user.role !== EUserRole.MANAGER) {
    return {
      error: "Você não tem permissão para criar serviços"
    }
  }

  const result = createServiceSchema.safeParse(data)
  if (!result.success) {
    return {
      error: JSON.stringify(result.error.flatten())
    }
  }

  try {
    // Create a signed URL for the cover image upload if it exists
    let coverImage: string | undefined = undefined
    let imageSignedUrl: string | undefined = undefined

    const uuid = randomUUID()

    if (data.coverImage && data.imageContentType) {
      try {
        const filePath = `services/${uuid}/profile.${data.coverImage.split('.').pop() || 'jpg'}`

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
        coverImage = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${encodedPath}?alt=media`
      } catch (error) {
        console.error("Error generating signed URL:", error)
        throw new Error("Error generating signed URL")
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageContentType, ...dto } = data

    const { data: user } = await axiosClient.post<IServiceView>(`/services`, {
      ...dto,
      coverImage,
    })
    return {
      data: {
        ...user,
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

    console.error(error)
    return {
      error: error.message
    }
  }
}

export async function updateServiceAction(id: string, data: UpdateServiceInput): Promise<IActionResponse<IServiceView>> {
  const session = await getSession()

  if (session?.user.role !== EUserRole.ADMIN && session?.user.role !== EUserRole.MANAGER) {
    return {
      error: "Você não tem permissão para editar serviços"
    }
  }

  const result = updateServiceSchema.safeParse(data)
  if (!result.success) {
    return {
      error: JSON.stringify(result.error.flatten())
    }
  }

  try {
    let coverImage: string | undefined = undefined
    let imageSignedUrl: string | undefined = undefined

    if (data.coverImage && data.imageContentType) {
      try {
        const filePath = `services/${id}/profile.${data.coverImage.split('.').pop() || 'jpg'}`

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
        coverImage = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${encodedPath}?alt=media`
      } catch (error) {
        console.error("Error generating signed URL:", error)
        throw new Error("Error generating signed URL")
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageContentType, ...dto } = data

    const { data: user } = await axiosClient.put<IServiceView>(`/services/${id}`, {
      ...dto,
      coverImage,
    })

    revalidatePath(EPages.ADMIN_SERVICES)

    return {
      data: {
        ...user,
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

    console.error(error)
    return {
      error: error.message
    }
  }
}