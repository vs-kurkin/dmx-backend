import type { ChannelList, DeviceMode, SerialID } from '@dmx-cloud/dmx-types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

/**
 * The device schema.
 * @see https://mongoosejs.com/docs/schematypes.html
 */
@Schema()
export class Device {
  @Prop({ required: true, type: String }) name: string = ''
  @Prop({ required: true, type: Types.DocumentArray }) channels: ChannelList = []
  @Prop({ type: Map }) mode: DeviceMode = new Map()
  @Prop({ type: String }) universe: SerialID = ''
  @Prop({ type: String }) vendor: string = ''
  @Prop({ type: String }) model: string = ''
}

/**
 * Creates a new instance of the Device class.
 * @returns A new instance of the Device class.
 */
export const DeviceSchema = SchemaFactory.createForClass(Device)

/**
 * The Mongoose model for devices.
 */
export const DeviceModel = {
  name: Device.name,
  schema: DeviceSchema,
}
