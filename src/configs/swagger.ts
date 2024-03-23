import { npm_package_description, npm_package_name, npm_package_version } from '#configs/env.ts'
import { registerAs } from '@nestjs/config'

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
}

export default registerAs('swagger', (): SwaggerConfig => ({
  title: npm_package_name ?? '',
  description: npm_package_description ?? '',
  version: npm_package_version ?? '',
  path: '/doc',
}))
