import type { ChannelList, DeviceMode, SerialID } from '@dmx-cloud/dmx-types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
export class Device {
  @Prop({ required: true, type: String }) name: string = ''
  @Prop({ required: true, type: Types.DocumentArray }) channels: ChannelList = []
  @Prop({ type: Map }) mode: DeviceMode = new Map()
  @Prop({ type: String }) universe: SerialID = ''
  @Prop({ type: String }) vendor: string = ''
  @Prop({ type: String }) model: string = ''
}

export const DeviceSchema = SchemaFactory.createForClass(Device)

export const DeviceModel = {
  name: Device.name,
  schema: DeviceSchema,
}
