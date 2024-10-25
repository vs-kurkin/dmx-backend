import process from 'process'

export const {
  NODE_ENV,
  npm_package_name,
  npm_package_description,
  npm_package_version,
} = process.env

/**
 * Production environment.
 */
export const PRODUCTION = 'production'

/**
 * Development environment.
 */
export const DEVELOPMENT = 'development'

/**
 * List of environment files to load.
 */
export const ENV_FILES: string[] = [
  '.env.development',
  '.env.production'
]

/**
 * Check if the current environment is production.
 *
 * @returns {boolean} True if current environment is production, false otherwise.
 */
export const isProduction = (): boolean => NODE_ENV === PRODUCTION

/**
 * Check if the current environment is development.
 *
 * @returns {boolean} True if current environment is development, false otherwise.
 */
export const isDevelopment = (): boolean => NODE_ENV === DEVELOPMENT
