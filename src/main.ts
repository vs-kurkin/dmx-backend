import 'module-alias/register.js'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, PartialGraphHost } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as process from 'process'
import AppModule from './app.js'
import { type ServerConfig } from './configs/server.js';
import { type SwaggerConfig } from './configs/swagger.js';
import logger from './utils/logger.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  setupLogger(app)
  setupSwagger(app)
  setupValidationPipe(app)

  await listenServer(app)
}

const setupLogger = (app: INestApplication) => {
  app.useLogger(logger)
}

const setupSwagger = (app: INestApplication) => {
  const config = app.get(ConfigService)
  const {title, description, version, path} = config.get('swagger') as SwaggerConfig

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
  const { port} = config.get('server') as ServerConfig

  await app.listen(port)

  logger.log(`Listening on ${await app.getUrl()}...`)
}

bootstrap().catch(() => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '')

  process.exit(1)
})
