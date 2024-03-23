import { Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'

interface EnvironmentVariables {
  HOST: string;
  PORT: number;
  NODE_ENV: 'development' | 'testing' | 'production';
}

@Injectable()
export class Config {
  constructor(private config: ConfigService<EnvironmentVariables>) {
    this.config = config
  }

  get isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production'
  }
}
