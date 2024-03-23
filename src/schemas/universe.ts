import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
export class Universe {
  @Prop({ required: true, unique: true, type: Types.ObjectId })
  id: string | undefined

  @Prop({ required: true, type: String })
  driver: string | undefined

  @Prop({ required: true, type: String })
  path: string | undefined
}

export const UniverseSchema = SchemaFactory.createForClass(Universe)
