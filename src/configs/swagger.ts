import { registerAs } from '@nestjs/config';

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
}

export default registerAs('swagger', (): SwaggerConfig => ({
  title: process.env.npm_package_name,
  description: process.env.npm_package_description,
  version: process.env.npm_package_version,
  path: '/doc'
}))
