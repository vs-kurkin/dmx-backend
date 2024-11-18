import AppModule from '#app'
import type {ServerOptions} from '#configs/server'
import type {SwaggerOptions} from '#configs/swagger'
import logger from '#utils/logger'
import {type INestApplication, ValidationPipe} from '@nestjs/common'
import {NestFactory, PartialGraphHost} from '@nestjs/core'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import * as fs from 'node:fs'
import {DEFAULT_PORT} from "#utils/constants"
import {getConfig} from "#utils/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: false,
    forceCloseConnections: true,
  })

  setupCORS(app)
  setupLogger(app)
  setupSwagger(app)
  setupValidationPipe(app)

  app.enableShutdownHooks()

  await listenServer(app)
}

const setupCORS = (app: INestApplication) => {
  const {isProduction} = getConfig(app)

  app.enableCors({
    origin: isProduction ? false : '*',
  })
}

const setupLogger = (app: INestApplication) => {
  app.useLogger(logger)
}

const setupSwagger = (app: INestApplication) => {
  const {title, description, version, path, definition} = getConfig<SwaggerOptions>(app, 'swagger')

  const builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .build()

  const document = SwaggerModule.createDocument(app, builder)

  fs.writeFileSync(definition, JSON.stringify(document, null, 2))

  SwaggerModule.setup(path, app, document)
}

const setupValidationPipe = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe())
}

const listenServer = async (app: INestApplication) => {
  const {port = DEFAULT_PORT} = getConfig<ServerOptions>(app, 'server')
  const {path} = getConfig<SwaggerOptions>(app, 'swagger')

  await app.listen(port)

  const url = await app.getUrl()

  logger.log(`Backend host: ${url}`)
  logger.log(`Swagger host: ${new URL(path, url).toString()}`)
}

const errorHandler = (error: unknown) => {
  logger.error('An error occurred:', error instanceof Error ? error.stack : String(error))

  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '')

  process.exit(1)
}

bootstrap()
  .catch(errorHandler)
