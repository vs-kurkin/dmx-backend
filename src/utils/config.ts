import { ENV_FILES } from '#configs/env'
import { MODELS, MONGODB_URI } from '#configs/mongodb'
import ServerConfig from '#configs/server'
import SwaggerConfig from '#configs/swagger'
import WebSocketConfig from '#configs/websocket'
import { Injectable } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'

interface EnvironmentVariables {
  HOST: string;
  PORT: number;
  NODE_ENV: 'development' | 'testing' | 'production';
}

type ConfigMap = ConfigService<EnvironmentVariables>

export const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
    envFilePath: ENV_FILES,
    load: [
      ServerConfig,
      WebSocketConfig,
      SwaggerConfig,
    ],
  }),

  EventEmitterModule.forRoot(),

  MongooseModule.forRoot(MONGODB_URI),
  MongooseModule.forFeature(MODELS),

  // DevtoolsModule.register(DevToolsConfig()),
]

@Injectable()
export class Config {
  private readonly config: ConfigMap

  constructor(config: ConfigMap) {
    this.config = config
  }

  // noinspection JSUnusedGlobalSymbols
  get isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production'
  }
}
