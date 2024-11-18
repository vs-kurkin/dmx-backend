import {npm_package_description, npm_package_name, npm_package_version} from '#configs/env'
import {registerAs} from '@nestjs/config'

export interface SwaggerConfig {
  readonly definition: string;
  readonly description: string;
  readonly path: string;
  readonly title: string;
  readonly version: string;
}

export type SwaggerOptions = Readonly<SwaggerConfig>

export default registerAs('swagger', (): SwaggerOptions => ({
  definition: 'openapi.json',
  description: npm_package_description ?? '',
  path: '/swagger',
  title: npm_package_name ?? '',
  version: npm_package_version ?? '',
}))
