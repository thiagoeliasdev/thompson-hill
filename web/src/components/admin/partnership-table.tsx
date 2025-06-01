"use client"

import { DataTable } from "../ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Edit2Icon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { formatCurrency } from "@/lib/utils"
import { IPartnershipView } from "@/models/partnerships"

interface Props {
  data?: IPartnershipView[]
  isLoading?: boolean
  emptyMessage?: string
  disablePagination?: boolean
  filtering?: {
    enableFiltering: boolean
    field: string
    placeholder: string
  }
  onEditButtonClick?: (user: IPartnershipView) => void
}

export default function PartnershipsTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum convênio encontrado",
  onEditButtonClick,
}: Props) {
  function getColumns(): ColumnDef<IPartnershipView>[] {
    return [
      {
        accessorKey: "name",
        header: "Título",
      },
      {
        accessorKey: "discountValue",
        header: () => <p className="text-center">Preço</p>,
        cell: (row) => <p className="text-center">{formatCurrency(row.getValue() as number)}</p>,
      },
      {
        accessorKey: "createdAt",
        header: () => <p className="hidden sm:block text-center">Cadastrado em</p>,
        cell: (row) => <p className="hidden sm:block text-center">{format(new Date(row.getValue() as string), "dd/MMM/yy", {
          locale: ptBR
        })}</p>,
      },
      {
        id: "actions",
        header: () => <p className="text-center">Ações</p>,
        cell: (row) => {
          const user = row.row.original

          return (
            <div className="flex justify-center items-center gap-1">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  if (onEditButtonClick) {
                    onEditButtonClick(user)
                  }
                }}
              ><Edit2Icon /></Button>
            </div>
          )
        }
      }
    ]
  }

  return (
    <DataTable
      columns={getColumns()}
      data={data}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
    />
  )
}