import type { SerialDriver, SerialID } from '@dmx-cloud/dmx-types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

/**
 * The universe schema.
 * @see https://mongoosejs.com/docs/schematypes.html
 */
@Schema()
export class Universe {
  @Prop({ required: true, unique: true, type: Types.ObjectId }) id?: SerialID
  @Prop({ required: true, type: String }) driver?: SerialDriver
  @Prop({ required: true, type: String }) path?: string
}

/**
 * The universe model.
 */
export const UniverseModel = {
  name: Universe.name,
  schema: SchemaFactory.createForClass(Universe)
}

