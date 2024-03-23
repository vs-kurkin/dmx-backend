import AppModule from '#app.ts'
import { isProduction } from '#configs/env.ts'
import { ServerConfig } from '#configs/server.ts'
import { SwaggerConfig } from '#configs/swagger.ts'
import logger from '#utils/logger.ts'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, PartialGraphHost } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as process from 'process'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  })

  setupCORS(app)
  setupLogger(app)
  setupSwagger(app)
  setupValidationPipe(app)

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
  const { title, description, version, path } = config.get('swagger') as SwaggerConfig

  const builderConfig = new DocumentBuilder()
  .setTitle(title)
  .setDescription(description)
  .setVersion(version)
  .build()

  const document = SwaggerModule.createDocument(app, builderConfig)

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

  logger.log(`Backend API: ${url}`)
  logger.log(`Swagger API: ${new URL(path, url).toString()}`)
}

bootstrap().catch((error: unknown) => {
  console.error(error)

  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '')

  process.exit(1)
})
