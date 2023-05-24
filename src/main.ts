import * as fs from 'fs';
import * as process from 'process';
import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import App from './app.js';

const NODE_PORT = process.env.NODE_PORT ? Number(process.env.NODE_PORT) : 3000;

async function bootstrap() {
  const app = await NestFactory.create(App);

  setupSwagger(app);
  setupValidationPipe(app);

  await app.listen(NODE_PORT);
}

const setupSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle(process.env.npm_package_name)
    .setDescription(process.env.npm_package_description)
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
};

const setupValidationPipe = (app) => {
  app.useGlobalPipes(new ValidationPipe());
};

bootstrap()
  .then(() => console.log(`Listening on http://localhost:${NODE_PORT}...`))
  .catch(() => {
    fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
    process.exit(1);
  });
