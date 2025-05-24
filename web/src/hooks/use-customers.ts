import { useQuery } from '@tanstack/react-query'
import { IPaginated } from "./use-paginated-query"
import { ICustomerView } from "@/models/customer"
import { queries } from "@/lib/query-client"
import { IActionResponse } from "@/models/action-response"
import { getCustomersAction } from "@/actions/customers"


export interface UseCustomersParams {
  page?: number
  limit?: number
  name?: string
  phoneNumber?: string
  referralCode?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

export const useCustomers = (params: UseCustomersParams = {}) => {
  return useQuery<IPaginated<ICustomerView>>({
    queryKey: [queries.admin.customers, params],
    queryFn: async () => {
      const response: IActionResponse<IPaginated<ICustomerView>> = await getCustomersAction(params)

      if (!response.data) {
        throw new Error(response.error || 'Erro ao buscar clientes')
      }

      return {
        ...response.data,
        data: response.data.data.map((customer) => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          birthDate: new Date(customer.birthDate),
        })),
      }
    },
    refetchOnWindowFocus: true,
  })
}
