import dd from 'dd-trace'
dd.init({
  profiling: true,
  service: 'subscription-worker',
})
import Logger from './logger.js'
import config from './config.js'
import listenEvents from './listener.js'
import pg from './pg.js'
import app from './grpc.js'

const logger = Logger.create().withScope('application')

process.on('uncaughtException', (err) => {
  logger.fatal(err)
  process.exit(1)
})

const boot = async () => {
  try {
    app.start(`0.0.0.0:${config.port}`)
    await pg.raw('select 1+1 as result')
    await listenEvents()
    logger.info(`server listening on 0.0.0.0:${config.port}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}
boot()
