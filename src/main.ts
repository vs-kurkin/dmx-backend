import AppModule from '#app'
import { isProduction } from '#configs/env'
import type { ServerConfig } from '#configs/server'
import type { SwaggerConfig } from '#configs/swagger'
import logger from '#utils/logger'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, PartialGraphHost } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'node:fs'

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
  app.enableCors({
    origin: isProduction() ? false : '*',
  })
}

const setupLogger = (app: INestApplication) => {
  app.useLogger(logger)
}

const setupSwagger = (app: INestApplication) => {
  const config = app.get(ConfigService)
  const { title, description, version, path, definition } = config.get('swagger') as SwaggerConfig

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
  const config = app.get(ConfigService)
  const { port } = config.get('server') as ServerConfig
  const { path } = config.get('swagger') as SwaggerConfig

  await app.listen(port)

  const url = await app.getUrl()

  logger.log(`Backend host: ${url}`)
  logger.log(`Swagger host: ${new URL(path, url).toString()}`)
}

const errorHandler = (error: unknown) => {
  logger.error(error)

  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '')

  process.exit(1)
}

bootstrap()
  .catch(errorHandler)
