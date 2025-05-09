import { Inject, Injectable } from '@nestjs/common'
import { Model } from "mongoose"
import { ServiceNotFoundException } from "../errors"
import { IMongoService, toService } from "../mongo/schemas/service.schema"
import { CreateServiceInput } from "./dto/create-service.input"
import { Service } from "./entities/service.entity"
import { createId } from "@paralleldrive/cuid2"
import { UpdateServiceInput } from "./dto/update-service.input"

@Injectable()
export class ServicesService {
  constructor(
    @Inject("ServiceSchema") private readonly serviceSchema: Model<IMongoService>,
  ) { }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceSchema.findOne({ _id: id })
    if (!service) throw new ServiceNotFoundException()
    return toService(service)
  }

  async create(createServiceDto: CreateServiceInput): Promise<Service> {
    const id = createId()

    const service = new this.serviceSchema({
      _id: id,
      name: createServiceDto.name,
      description: createServiceDto.description,
      value: createServiceDto.value,
      coverImage: createServiceDto.coverImage,
      createdAt: new Date(),
    })

    await service.save()

    return { ...toService(service) }
  }


  async findAll(): Promise<Service[]> {
    const services = await this.serviceSchema.find().sort({ name: 1 })
    return services.map((service) => toService(service))
  }

  async update(id: string, updateServiceDto: UpdateServiceInput): Promise<Service> {
    const service = await this.serviceSchema.findOneAndUpdate(
      { _id: id },
      updateServiceDto,
      { new: true }
    )
    if (!service) throw new ServiceNotFoundException()
    return toService(service)
  }

  async remove(id: string): Promise<Service> {
    const service = await this.serviceSchema.findOneAndDelete({ _id: id })
    if (!service) throw new ServiceNotFoundException()
    return toService(service)
  }
}

