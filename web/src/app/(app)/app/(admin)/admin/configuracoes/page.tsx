"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { H1 } from "@/components/ui/typography"
import { useAdmin } from "@/hooks/use-admin"
import { PlusIcon } from "lucide-react"
import React from 'react'
import ApiKeyForm from "@/components/admin/api-key-form"
import ApiKeysTable from "@/components/admin/api-key-table"

export default function ProductsPage() {
  const { apiKeys, isLoadingApiKeys, deleteApiKey } = useAdmin()

  return (
    <div className="w-full flex flex-col max-w-[1440px] mx-auto">
      <H1>Chaves de API</H1>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full sm:w-fit"
          ><PlusIcon />Cadastrar Chave</Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Chave</DialogTitle>
          </DialogHeader>
          <ApiKeyForm />
        </DialogContent>
      </Dialog>

      <Card className="mt-2">
        <CardContent>
          <ApiKeysTable
            data={apiKeys}
            isLoading={isLoadingApiKeys}
            onDeleteButtonClick={(data) => deleteApiKey(data.id)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
