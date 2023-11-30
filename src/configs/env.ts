import process from 'process'

export const {
  NODE_ENV,
  NEST_SOCKET_PORT,
  npm_package_name,
  npm_package_description,
  npm_package_version
} = process.env

export const PRODUCTION = 'production'
export const DEVELOPMENT = 'development'

export const isProduction = () => NODE_ENV === PRODUCTION
export const isDevelopment = () => NODE_ENV === DEVELOPMENT
