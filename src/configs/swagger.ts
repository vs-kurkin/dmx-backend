import { npm_package_description, npm_package_name, npm_package_version } from '#configs/env'
import { registerAs } from '@nestjs/config'

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
  definition: string;
}

export default registerAs('swagger', (): SwaggerConfig => ({
  definition: 'openapi.json',
  path: '/swagger',
  title: npm_package_name ?? '',
  description: npm_package_description ?? '',
  version: npm_package_version ?? '',
}))
