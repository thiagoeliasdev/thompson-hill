import { getAppointmentsAction } from "@/actions/appointments"
import { getCustomersAction, updateCustomerAction } from "@/actions/customers"
import { UpdateCustomerInput } from "@/actions/customers/dto/update-customer.input"
import { createServiceAction, getServicesAction, updateServiceAction } from "@/actions/services"
import { CreateServiceInput } from "@/actions/services/dto/create-service.input"
import { UpdateServiceInput } from "@/actions/services/dto/update-service.input"
import { createUserAction, getUsersAction, updateUserAction } from "@/actions/users"
import { CreateUserInput } from "@/actions/users/dtos/create-user.input"
import { UpdateUserInput } from "@/actions/users/dtos/update-user.input"
import { queries } from "@/lib/query-client"
import { IActionResponse } from "@/models/action-response"
import { IAppointmentView } from "@/models/appointment"
import { ICustomerView } from "@/models/customer"
import { IServiceView } from "@/models/service"
import { IUserView } from "@/models/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAdmin = () => {
  const queryClient = useQueryClient()

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: [queries.admin.users],
    queryFn: async (): Promise<IUserView[]> => {
      const response = await getUsersAction()

      if (response.data) {
        return response.data.map((user) => ({
          ...user,
          createdAt: new Date(user.createdAt)
        }))
      }

      return response.data || []
    },
  })

  const { mutateAsync: createUser } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (data: CreateUserInput): Promise<IActionResponse<IUserView>> => {
      const response = await createUserAction(data)

      if (response.data) {
        queryClient.setQueryData([queries.admin.users], (current: IUserView[]) => {
          if (!current) return [response.data]
          return [...current, response.data]
        })

        return response
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  const { mutateAsync: updateUser } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async ({ id, userName, data }: { id: string, userName: string, data: UpdateUserInput }): Promise<IActionResponse<IUserView>> => {
      const response = await updateUserAction(id, userName, data)

      if (!!response.data) {
        queryClient.setQueryData([queries.admin.users], (current: IUserView[]) => {
          return current?.map((user) => {
            if (user.id === response.data?.id) {
              return { ...user, ...response.data }
            }
            return user
          })
        })

        return response
      }

      return response
    }
  })

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: [queries.admin.services],
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

  const { mutateAsync: createService } = useMutation({
    mutationKey: ["createService"],
    mutationFn: async (data: CreateServiceInput): Promise<IActionResponse<IServiceView>> => {
      const response = await createServiceAction(data)

      if (response.data) {
        queryClient.setQueryData([queries.admin.services], (current: IServiceView[]) => {
          if (!current) return [response.data]
          return [...current, response.data]
        })

        return response
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  const { mutateAsync: updateService } = useMutation({
    mutationKey: ["updateService"],
    mutationFn: async ({ id, data }: { id: string, data: UpdateServiceInput }): Promise<IActionResponse<IServiceView>> => {
      const response = await updateServiceAction(id, data)

      if (!!response.data) {
        queryClient.setQueryData([queries.admin.services], (current: IServiceView[]) => {
          return current?.map((service) => {
            if (service.id === response.data?.id) {
              return { ...service, ...response.data }
            }
            return service
          })
        })

        return response
      }

      return response
    }
  })

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: [queries.admin.customers],
    queryFn: async (): Promise<ICustomerView[]> => {
      const response = await getCustomersAction()

      if (response.data) {
        return response.data.map((service) => ({
          ...service,
          createdAt: new Date(service.createdAt)
        }))
      }

      return response.data || []
    },
  })

  const { mutateAsync: updateCustomer } = useMutation({
    mutationKey: ["updateSCustomer"],
    mutationFn: async ({ id, data }: { id: string, data: UpdateCustomerInput }): Promise<IActionResponse<ICustomerView>> => {
      const response = await updateCustomerAction(id, data)

      if (!!response.data) {
        queryClient.setQueryData([queries.admin.customers], (current: ICustomerView[]) => {
          return current?.map((customer) => {
            if (customer.id === response.data?.id) {
              return { ...customer, ...response.data }
            }
            return customer
          })
        })

        return response
      }

      return response
    }
  })

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: [queries.admin.appointments],
    queryFn: async (): Promise<IAppointmentView[]> => {
      const response = await getAppointmentsAction()

      if (response.data) {
        return response.data.map((appointment) => ({
          ...appointment,
          createdAt: new Date(appointment.createdAt),
          onServiceAt: appointment.onServiceAt ? new Date(appointment.onServiceAt) : undefined,
          finishedAt: appointment.finishedAt ? new Date(appointment.finishedAt) : undefined,
        }))
      }

      return response.data || []
    },
  })

  return {
    users,
    isLoadingUsers,
    createUser,
    updateUser,
    services,
    isLoadingServices,
    createService,
    updateService,
    customers,
    isLoadingCustomers,
    updateCustomer,
    appointments,
    isLoadingAppointments,
  }
}