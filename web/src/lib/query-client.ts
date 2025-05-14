import { QueryClient, } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export const queries = {
  admin: {
    users: "admin_users",
    services: "admin_services",
    customers: "admin_customers",
  },
  totem: {
    attendants: "totem_attendants",
    customer: "totem_customer",
    services: "totem_services",
  }
}