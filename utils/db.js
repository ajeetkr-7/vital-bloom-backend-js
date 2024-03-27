import mongoose from "mongoose";
import logger from "./logger.js";
import CONFIG from "./config.js";


export default (cb)=>{
    
logger.info('connecting to database...')
mongoose.set('strictQuery', true);
mongoose
  .connect(CONFIG.MONGOOSE_URI,)
  .then(() => {
    logger.info('Mongoose connection done')
    cb();
  })
  .catch((e) => {
    logger.info('Mongoose connection error')
    logger.error(e)
  })

// CONNECTION EVENTS
// When successfully connected
mongoose.connections[0].on('connected', () => {
  logger.debug('Mongoose default connection open to Mongoose Database')
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  logger.error('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection (ctrl + c)
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: ' + err)
})
}