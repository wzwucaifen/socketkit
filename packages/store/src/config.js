export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3002,
  postgresql: process.env.DATABASE_URL,
}
