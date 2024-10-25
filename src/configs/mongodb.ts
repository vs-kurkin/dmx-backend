import { DeviceModel } from '#schemas/device'
import { UniverseModel } from '#schemas/universe'

const HOST = process.env.MONGODB_HOST ?? 'localhost:27017'
const PATH = process.env.MONGODB_PATH ?? '/dmx'

/**
 * The MongoDB URI. Example: mongodb://localhost:27017
 */
export const MONGODB_URI = `mongodb://${HOST}${PATH}`

export const MODELS = [
  UniverseModel,
  DeviceModel
]
