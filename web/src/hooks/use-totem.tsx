import { createCustomerAction, getCustomerByPhoneAction } from "@/actions/customers"
import { CreateCustomerInput } from "@/actions/customers/dto/create-customer.input"
import { getAttendantsAction } from "@/actions/users"
import { queries } from "@/lib/query-client"
import { IActionResponse } from "@/models/action-response"
import { ICustomerView } from "@/models/customer"
import { IUserView } from "@/models/user"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useTotem = () => {
  const { data: attendants, isLoading: isLoadingAttendants } = useQuery({
    queryKey: [queries.totem.attendants],
    queryFn: async (): Promise<IActionResponse<IUserView[]>> => {

      const response = await getAttendantsAction()

      if (response.data) {
        return {
          data: response.data.map((user) => ({
            ...user,
            createdAt: new Date(user.createdAt)
          }))
        }
      }

      return response
    },
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })

  const { mutateAsync: getCustomer } = useMutation({
    mutationKey: ["getCustomerByPhone"],
    mutationFn: async (phoneNumber: string): Promise<IActionResponse<ICustomerView>> => {
      const response = await getCustomerByPhoneAction(phoneNumber)

      return response
    }
  })

  const { mutateAsync: registerCustomer } = useMutation({
    mutationKey: ["registerCustomer"],
    mutationFn: async (data: CreateCustomerInput): Promise<IActionResponse<ICustomerView>> => {
      const response = await createCustomerAction(data)

      return response
    }
  })

  return {
    getCustomer,
    registerCustomer,
    attendants,
    isLoadingAttendants
  }
}