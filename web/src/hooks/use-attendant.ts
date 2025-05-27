import { getAppointmentByIdAction, startAttendingAppointmentAction } from "@/actions/appointments"
import { getServicesAction } from "@/actions/services"
import { queries } from "@/lib/query-client"
import { IActionResponse } from "@/models/action-response"
import { IAppointmentView } from "@/models/appointment"
import { IServiceView } from "@/models/service"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useAttendant = () => {

  const { mutateAsync: startAttendance, isPending: isStartingAttendance } = useMutation({
    mutationKey: ["startAttendingAppointment"],
    mutationFn: async ({ id, attendantId }: {
      id: string,
      attendantId: string
    }): Promise<IActionResponse<IAppointmentView>> => {
      const response = await startAttendingAppointmentAction(id, attendantId)

      return response
    },
  })

  const { mutateAsync: findAttendance, isPending: isFindingAttendance } = useMutation({
    mutationKey: ["findAttendance"],
    mutationFn: async ({ id }: {
      id: string
    }): Promise<IActionResponse<IAppointmentView>> => {
      const response = await getAppointmentByIdAction(id)

      return response
    },
  })

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: [queries.attendant.services],
    queryFn: async (): Promise<IServiceView[]> => {
      const response = await getServicesAction()

      if (response.data) {
        return response.data.map((service) => ({
          ...service,
          createdAt: new Date(service.createdAt)
        }))
      }

      return response.data || []
    },
  })

  return {
    startAttendance,
    isStartingAttendance,
    findAttendance,
    isFindingAttendance,
    services,
    isLoadingServices,
  }
}