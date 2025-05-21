"use server"

import { IActionResponse } from "@/models/action-response"
import { CreateAppointmentInput, createAppointmentSchema } from "./dto/create-appointment.input"
import { EAppointmentStatuses, IAppointmentView } from "@/models/appointment"
import { getSession } from "@/lib/session"
import axiosClient from "@/lib/axios"

const APPOINTMENTS_END_POINT = "/appointments"

export async function createAppointmentAction(data: CreateAppointmentInput): Promise<IActionResponse<IAppointmentView>> {
  const session = await getSession()

  if (!session?.user) {
    return {
      error: "Você não tem permissão para registrar serviços"
    }
  }

  const { success, data: validatedData, error } = createAppointmentSchema.safeParse(data)
  if (!success) {
    return {
      error: JSON.stringify(error.flatten())
    }
  }

  try {
    const { data: appointment } = await axiosClient.post<IAppointmentView>(APPOINTMENTS_END_POINT, validatedData)
    return {
      data: appointment
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

export async function getAppointmentsAction(): Promise<IActionResponse<IAppointmentView[]>> {
  try {
    const { data } = await axiosClient.get<IAppointmentView[]>(APPOINTMENTS_END_POINT)
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

export async function startAttendingAppointmentAction(id: string, attendantId: string): Promise<IActionResponse<IAppointmentView>> {
  try {
    const { data } = await axiosClient.put<IAppointmentView>(`${APPOINTMENTS_END_POINT}/${id}`, {
      attendantId: attendantId,
      status: EAppointmentStatuses.ON_SERVICE
    })
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