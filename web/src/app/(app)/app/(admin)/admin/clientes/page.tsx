"use client"

import CustomersTable from "@/components/admin/customers-table"
import UpdateCustomerForm from "@/components/admin/update-customer-form"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { H1 } from "@/components/ui/typography"
import { useCustomers, UseCustomersParams } from "@/hooks/use-customers"
import { ICustomerView } from "@/models/customer"
import CustomerSearchForm, { CustomerSearchFormSchema } from "./customer-search-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function CustomersPage() {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomerView | undefined>(undefined)
  const [params, setParams] = useState<UseCustomersParams>({
    page: 1,
    limit: 10,
    order: "desc",
    sortBy: "createdAt"
  })
  const { data: paginatedCustomers, isLoading } = useCustomers(params)

  function handleFormSubmit(values: CustomerSearchFormSchema) {
    setParams((prev) => ({
      ...prev,
      ...values,
      limit: 10,
    }))
  }

  function handleLoadMore() {
    setParams((prev) => ({
      ...prev,
      limit: (prev.limit || 0) + 10
    }))
  }

  return (
    <div className="w-full flex flex-col max-w-[1440px] mx-auto">
      <H1>Clientes</H1>
      <Sheet
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedCustomer ? `Atualizar ${selectedCustomer.name}` : "Cadastrar novo serviço"}</SheetTitle>
            <SheetDescription>
              {selectedCustomer ? "Atualize as informações do serviço" : "Preencha os dados para cadastrar um novo serviço"}
            </SheetDescription>
          </SheetHeader>
          {selectedCustomer && (
            <ScrollArea className="h-[90%] pr-4">
              <div className="px-1">
                <UpdateCustomerForm
                  params={params}
                  customer={selectedCustomer}
                  onSuccess={() => {
                    setSheetOpen(false)
                  }}
                />
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      <Card className="mt-4 mb-4">
        <CardContent>
          <CardTitle>Parâmetros de Busca</CardTitle>
          <CustomerSearchForm
            onSubmit={handleFormSubmit}
          />
        </CardContent>
      </Card>

      <Card className="">
        <CardContent className="space-y-4">
          <CustomersTable
            data={paginatedCustomers?.data}
            isLoading={isLoading}
            emptyMessage="Nenhum cliente encontrado"
            filtering={{
              enableFiltering: true,
              field: "name",
              placeholder: "Buscar por título",
            }}
            onEditButtonClick={(customer) => {
              setSelectedCustomer(customer)
              setSheetOpen(true)
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLoadMore}
            isLoading={isLoading}
          >Carregar Mais</Button>
        </CardContent>
      </Card>
    </div>
  )
}
