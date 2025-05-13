"use client"

import CustomersTable from "@/components/admin/customers-table"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { H1 } from "@/components/ui/typography"
import { useAdmin } from "@/hooks/use-admin"
import { ICustomerView } from "@/models/customer"
import { useState } from "react"

export default function CustomersPage() {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomerView | undefined>(undefined)
  const { customers, isLoadingCustomers } = useAdmin()

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
          {/* {selectedService && (
            <UpdateServiceForm
              service={selectedService}
              onSuccess={() => {
                setSheetOpen(false)
              }}
            />
          )} */}
        </SheetContent>
      </Sheet>

      <Card className="mt-2">
        <CardContent>
          <CustomersTable
            data={customers}
            isLoading={isLoadingCustomers}
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
        </CardContent>
      </Card>
    </div>
  )
}
