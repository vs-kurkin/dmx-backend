import * as fs from 'fs';
import * as process from 'process';
import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import App from './app.js';

const NODE_PORT = process.env.NODE_PORT ? Number(process.env.NODE_PORT) : 3000;

async function bootstrap() {
  const app = await NestFactory.create(App);

  const config = new DocumentBuilder()
    .setTitle(process.env.npm_package_name)
    .setDescription(process.env.npm_package_description)
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(NODE_PORT);
}

bootstrap()
  .then(() => console.log(`Listening on http://localhost:${NODE_PORT}...`))
  .catch(() => {
    fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
    process.exit(1);
  });
