"use client"

import { images } from "@/lib/images"
import { useRouter, useSearchParams } from "next/navigation"
import { EPages } from "@/lib/pages.enum"
import { IUserView } from "@/models/user"
import TotemServiceCard from "@/components/totem/service-card"
import NoPreferenceCard from "@/components/totem/no-preference-card"
import { useTotem } from "@/hooks/use-totem"
import LoadingIndicator from "@/components/ui/loading-indicator"

export default function AttendantsPageContents() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const customerId = searchParams.get('id')
  const serviceId = searchParams.get('service')
  const { createAppointment, isCreatingAppointment } = useTotem()

  const { attendants, isLoadingAttendants } = useTotem()
  // Must order by name asc
  const orderedAttendants = attendants?.data?.sort((a, b) => a.name.localeCompare(b.name))

  async function handleConfirmation(user: IUserView | undefined) {
    try {
      if (!customerId || !serviceId) {
        console.error("Customer ID or Service ID is missing")
        router.push(EPages.TOTEM_HOME)
        return
      }

      const { data: appointment, error } = await createAppointment({
        customerId,
        attendantId: user?.id || undefined,
        serviceIds: [serviceId]
      })

      if (appointment) router.push(EPages.TOTEM_CONFIRMATION)
      if (error) {
        console.error("Error creating appointment:", error)
        // router.push(EPages.TOTEM_HOME)
      }
    } catch (error) {
      console.error("Error creating appointment:", error)
    }
  }

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-semibold leading-relaxed font-spectral tracking-wide">Preferência de atendimento</h1>

      <div className="flex-1 w-full flex flex-col gap-6 items-center justify-start">
        {(isLoadingAttendants || isCreatingAppointment) ? (
          <LoadingIndicator size="xl" />
        ) : (
          <div className="w-full flex flex-row flex-wrap justify-center items-center gap-6">
            {orderedAttendants?.map((attendant) => (
              <TotemServiceCard
                key={attendant.id}
                id={attendant.id}
                title={attendant.name}
                image={attendant.profileImage || images.userPlaceholder}
                handleClick={() => handleConfirmation(attendant)}
              />
            ))}
            <NoPreferenceCard
              handleClick={() => handleConfirmation(undefined)}
            />
          </div>
        )}
      </div >
    </>
  )
}
