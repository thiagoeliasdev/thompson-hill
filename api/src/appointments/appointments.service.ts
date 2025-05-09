import { Inject, Injectable } from '@nestjs/common'
import { CreateAppointmentInput } from "./dto/create-customer.input"
import { Appointment, EAppointmentStatuses } from "./entities/appointment.entity"
import { Model } from "mongoose"
import { IMongoAppointment, toAppointment } from "../mongo/schemas/appointment.schema"
import { createId } from "@paralleldrive/cuid2"

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject("AppointmentSchema") private readonly appointmentSchema: Model<IMongoAppointment>,
  ) { }

  async create(dto: CreateAppointmentInput): Promise<Appointment> {
    const id = createId()
    console.log("Creating appointment", id, dto)

    let serviceIds: string[] = dto.serviceIds

    const appointment = new this.appointmentSchema(
      {
        _id: id,
        customerId: dto.customerId,
        attendantId: dto.attendantId,
        serviceIds,
        totalPrice: 0,
        discount: 0,
        finalPrice: 0,
        status: EAppointmentStatuses.WAITING
      }
    )

    const createdAppointment = await appointment.save()
    createdAppointment.totalPrice = createdAppointment?.services?.reduce((acc, service) => acc + service.value, 0) || 0
    createdAppointment.finalPrice = createdAppointment.totalPrice - (createdAppointment.discount || 0)
    await createdAppointment.save()

    return toAppointment(createdAppointment)
  }

  async findAll(): Promise<Appointment[]> {
    throw new Error('Method not implemented.')
  }

  async findOne(id: string): Promise<Appointment> {
    throw new Error('Method not implemented.')
  }

  async remove(id: string): Promise<Appointment> {
    throw new Error('Method not implemented.')
  }
}
