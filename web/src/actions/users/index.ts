"use server"

import axiosClient from "@/lib/axios"
import { EUserRole, IUserView } from "@/models/user"
import { CreateUserInput, createUserSchema } from "./dtos/create-user.input"
import { getSession } from "@/lib/session"
import { UpdateUserInput, updateUserSchema } from "./dtos/update-user.input"
import { revalidatePath } from "next/cache"
import { EPages } from "@/lib/pages.enum"
import { IActionResponse } from "@/models/action-response"

export async function getProfileAction(): Promise<IActionResponse<IUserView>> {
  try {
    const { data } = await axiosClient.get<IUserView>(`/users/profile`)
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

export async function getUsersAction(): Promise<IActionResponse<IUserView[]>> {
  try {
    const { data } = await axiosClient.get<IUserView[]>(`/users`)
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

export async function getAttendantsAction(): Promise<IActionResponse<IUserView[]>> {
  try {
    const { data } = await axiosClient.get<IUserView[]>(`/users/attendants`)
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

export async function createUserAction(data: CreateUserInput): Promise<IActionResponse<IUserView>> {
  const session = await getSession()

  if (session?.user.role !== EUserRole.ADMIN && session?.user.role !== EUserRole.MANAGER) {
    return {
      error: "Você não tem permissão para criar usuários"
    }
  }

  const result = createUserSchema("create").safeParse(data)
  if (!result.success) {
    return {
      error: JSON.stringify(result.error.flatten())
    }
  }

  try {
    // Create a signed URL for the profile image upload if it exists
    // let profileImage: string | undefined = undefined
    // let imageSignedUrl: string | undefined = undefined

    // if (data.profileImage && data.imageContentType) {
    //   try {
    //     const filePath = `users/${data?.userName?.toLowerCase().trim()}/profile.${data.profileImage.split('.').pop() || 'jpg'}`

    //     const fileRef = storage.file(filePath)
    //     const [signedUrl] = await fileRef.getSignedUrl({
    //       action: 'write',
    //       expires: Date.now() + 2 * 60 * 1000, // 2 minutes
    //       contentType: data.imageContentType,
    //       version: 'v4',
    //     })
    //     imageSignedUrl = signedUrl

    //     // Create a url for the profile image public access
    //     const encodedPath = encodeURIComponent(filePath)
    //     profileImage = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${encodedPath}?alt=media`
    //   } catch (error) {
    //     console.error("Error generating signed URL:", error)
    //     throw new Error("Error generating signed URL")
    //   }
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { profileImageContentType, ...dto } = data

    const { data: user } = await axiosClient.post<IUserView>(`/users`, data)
    return {
      data: user
    }

  } catch (err) {
    const error = err as Error
    if (error.message.includes("ECONNREFUSED")) {
      return {
        error: "Servidor não está disponível, tente novamente mais tarde."
      }
    }

    if (error.message.includes("User already exists")) {
      return {
        error: "Usuário já existe no sistema"
      }
    }

    console.error(error)
    return {
      error: error.message
    }
  }
}

export async function updateUserAction(id: string, userName: string, data: UpdateUserInput): Promise<IActionResponse<IUserView>> {
  const session = await getSession()

  if (session?.user.role !== EUserRole.ADMIN && session?.user.role !== EUserRole.MANAGER) {
    return {
      error: "Você não tem permissão para editar usuários"
    }
  }

  const result = updateUserSchema.safeParse(data)
  if (!result.success) {
    return {
      error: JSON.stringify(result.error.flatten())
    }
  }

  try {
    // Create a signed URL for the profile image upload if it exists
    // let profileImage: string | undefined = undefined
    // let profileImageSignedUrl: string | undefined = undefined

    // if (data.profileImage && data.profileImageContentType) {
    //   try {
    //     const filePath = `users/${userName.toLowerCase().trim()}/profile.${data.profileImage.split('.').pop() || 'jpg'}`

    //     const fileRef = storage.file(filePath)
    //     const [signedUrl] = await fileRef.getSignedUrl({
    //       action: 'write',
    //       expires: Date.now() + 2 * 60 * 1000, // 2 minutes
    //       contentType: data.profileImageContentType,
    //       version: 'v4',
    //     })
    //     profileImageSignedUrl = signedUrl

    //     // Create a url for the profile image public access
    //     const encodedPath = encodeURIComponent(filePath)
    //     profileImage = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${encodedPath}?alt=media`
    //   } catch (error) {
    //     console.error("Error generating signed URL:", error)
    //     throw new Error("Error generating signed URL")
    //   }
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { imageContentType, ...dto } = data

    const { data: user } = await axiosClient.put<IUserView>(`/users/${id}`, data)

    revalidatePath(EPages.ADMIN_ATTENDANTS)

    return {
      data: user
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
