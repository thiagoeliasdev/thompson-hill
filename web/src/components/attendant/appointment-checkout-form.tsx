"use client"

import { z } from "@/lib/pt-zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronLeftIcon, PlusIcon, XIcon } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useMemo, useRef, useState } from "react"
import { updateAppointmentSchema } from "@/actions/appointments/dto/update-appointment.input"
import { EAppointmentStatuses, EPaymentMethod, EPaymentMethodMapper, IAppointmentView } from "@/models/appointment"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { IServiceView } from "@/models/service"
import { formatCurrency } from "@/lib/utils"
import { H2 } from "../ui/typography"
import Indicator from "../ui/indicator"
import { Label } from "../ui/label"
import { IProductView } from "@/models/product"
import { useAppointments } from "@/hooks/use-appointments"

interface Props {
  attendantId: string
  appointment: IAppointmentView
  services: IServiceView[]
  products: IProductView[]
  onSuccess?: () => void
  onError?: () => void
}

export default function AppointmentCheckoutForm({ attendantId, appointment, services, products, onSuccess, onError }: Props) {
  const formSchema = updateAppointmentSchema

  const [step, setStep] = useState(0)

  const steps = ["Serviços Realizados", "Método de Pagamento", "Confirmação"]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendantId,
      paymentMethod: appointment.paymentMethod,
      status: EAppointmentStatuses.FINISHED,
      serviceIds: appointment.services.map((service) => service.id) || [],
      productIds: appointment.products.map((product) => product.id) || [],
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { updateAppointment } = useAppointments()

  // Log form errors
  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateAppointment({ id: appointment.id, data: { ...values } })
      toast.success("Salvo com sucesso", { icon: <CheckIcon /> })
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar")
      if (onError) onError()
    }
  }

  const servicesOptions = useMemo(() => {
    return services.map((service) => ({
      label: `${service.name} - ${formatCurrency(service.promoEnabled && service.promoValue ? service.promoValue : service.value)}`,
      value: service.id,
    }))
  }, [services])

  function handleAddService() {
    const serviceIds = form.getValues("serviceIds")
    form.setValue("serviceIds", [...serviceIds, ""])
    form.clearErrors("serviceIds")
  }

  function handleAddProduct() {
    const productIds = form.getValues("productIds") || []
    form.setValue("productIds", [...productIds, ""])
    form.clearErrors("productIds")
  }

  function handleRemoveService(index: number) {
    const serviceIds = form.getValues("serviceIds")
    const newServicesIds = serviceIds.filter((_, i) => i !== index)
    form.reset({ ...form.getValues(), serviceIds: newServicesIds })
  }

  function handleNextStep() {
    switch (step) {
      // Services step
      case 0:
        form.trigger("serviceIds")
          .then((isValid) => {
            if (isValid) setStep((prev) => prev + 1)
          })
        break

      // Payment method step
      case 1:
        setStep((prev) => prev + 1)
        break

      // Submit step
      case 2:
        formRef.current?.requestSubmit()
        break

      default:
        setStep((prev) => prev + 1)
        break
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full pt-6 flex flex-col gap-4"
        ref={formRef}
      >

        <H2 className="pb-4">{steps[step]}</H2>

        {step === 0 && (
          <FormItem>
            <FormMessage>{form.getFieldState("serviceIds").error?.message}</FormMessage>
            {form.watch().serviceIds.map((_, index) => (
              <div
                key={index}
              >
                <div
                  className="w-full flex justify-start items-center gap-1"
                >
                  <Select
                    onValueChange={(value) => {
                      form.setValue(`serviceIds.${index}`, value)
                    }}
                    defaultValue={form.getValues(`serviceIds.${index}`)}
                    value={form.getValues(`serviceIds.${index}`) || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {servicesOptions.map((item, index) => (
                        <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveService(index)}
                    className="h-14 w-12"
                  ><XIcon className="size-6" /></Button>
                </div>
                <FormMessage>{form.getFieldState(`serviceIds.${index}`).error?.message}</FormMessage>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleAddService}
              className="w-full border-3 border-dashed"
            ><PlusIcon /> Adicionar serviço</Button>
          </FormItem>
        )}

        {/* Payment Method */}
        {step === 1 && (
          <FormItem>
            {Object.values(EPaymentMethod).map((item) => (
              <Button
                key={item}
                type="button"
                size="lg"
                variant={form.watch("paymentMethod") === item ? "default" : "outline"}
                onClick={() => {
                  form.setValue("paymentMethod", item)
                  handleNextStep()
                }}
              >
                {EPaymentMethodMapper[item]}
              </Button>
            ))}
          </FormItem>
        )}

        {/* Checkout */}
        {step === 2 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row justify-between items-center gap-2">
              <Label className="flex-1">Serviços</Label>
              <Indicator className="w-32 justify-end">{formatCurrency(appointment.totalPrice)}</Indicator>
            </div>
            <div className="flex flex-row justify-between items-center gap-2">
              <Label className="flex-1">Descontos</Label>
              <Indicator className="w-32 justify-end">{formatCurrency(appointment.discount)}</Indicator>
            </div>
            <div className="flex flex-row justify-between items-center gap-2">
              <Label className="flex-1">Total</Label>
              <Indicator className="w-32 justify-end">{formatCurrency(appointment.finalPrice)}</Indicator>
            </div>
            <div className="flex flex-row justify-between items-center gap-2">
              <Label className="flex-1">Método de Pagamento</Label>
              <Indicator className="w-32 justify-end">{form.getValues().paymentMethod && EPaymentMethodMapper[form.getValues().paymentMethod as EPaymentMethod]}</Indicator>
            </div>
          </div>
        )}

        <div className="flex flex-row gap-2 w-full pt-6">

          <Button
            disabled={form.formState.isSubmitting}
            type="button"
            variant="secondary"
            size="lg"
            className="w-8"
            hidden={step === 0}
            onClick={() => setStep(prev => prev - 1)}
          ><ChevronLeftIcon className="size-6" /></Button>

          <Button
            isLoading={form.formState.isSubmitting}
            type="button"
            size="lg"
            className="flex-1"
            disabled={(step === 1 && form.watch().paymentMethod === undefined)}
            onClick={handleNextStep}
          >{step === 2 ? "Finalizar" : "Próximo"}</Button>
        </div>
      </form>
    </Form>
  )
}
