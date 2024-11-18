import {ENV_FILES} from '#configs/env'
import {MODELS, MONGODB_URI} from '#configs/mongodb'
import ServerConfig from '#configs/server'
import SwaggerConfig from '#configs/swagger'
import WebSocketConfig from '#configs/websocket'
import DevToolsConfig from '#configs/devtools'
import {type INestApplication, Injectable} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {EventEmitterModule} from '@nestjs/event-emitter'
import {MongooseModule} from '@nestjs/mongoose'
import {DevtoolsModule} from "@nestjs/devtools-integration"

enum Environment {
  'development' = 'development',
  'production' = 'production',
}

interface EnvironmentVariables {
  HOST: string;
  PORT: number;
  NODE_ENV: Environment;
}

type ConfigMap = ConfigService<EnvironmentVariables>;

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

  DevtoolsModule.register(DevToolsConfig()),
]

@Injectable()
export class Config {
  private readonly config: ConfigMap

  constructor(config: ConfigMap) {
    this.config = config
  }

  /**
   * Indicates whether the application is running in production mode.
   *
   * @returns true if in production, false otherwise
   */
  get isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production'
  }
}

/**
 * Retrieves a configuration value from the application's ConfigService.
 *
 * @param app - The NestJS application instance.
 * @param key - The key of the configuration value to retrieve.
 *
 * @returns The configuration value for the given key.
 *
 * @throws {Error} If the configuration key is not defined.
 */
export function getConfig<T = Config>(app: INestApplication, key?: string): T {
  const config = app.get(ConfigService);

  if (typeof key === 'string') {
    return config.getOrThrow(key)
  }

  return config as T
}


/**
 * Retrieves an environment variable from the application's ConfigService.
 *
 * @param app - The NestJS application instance.
 * @param key - The key of the environment variable to retrieve.
 * @returns The environment variable of type {@link EnvironmentVariables}, or undefined if the key does not exist.
 */
export const getEnv = (app: INestApplication, key: Environment): EnvironmentVariables | undefined => {
  return app.get(ConfigService).get(key)
}
