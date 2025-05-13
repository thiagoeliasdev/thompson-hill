import { QueryClient, } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export const queries = {
  admin: {
    users: "users",
    services: "services",
    customers: "customers",
  },
  totem: {
    attendants: "attendants",
    customer: "customer",
  }
}