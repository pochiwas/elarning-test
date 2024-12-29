import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import moment from 'moment-timezone'

const timezoned = () => {
  let timeWinston = moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss.SSS')
  return timeWinston.toString()
}
/*
const custom_format = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) =>
`${level}: ${message}\n${(metadata && Object.keys(metadata).length) ? JSON.stringify(metadata, null, 4) : ''}`

);
*/
const transport: DailyRotateFile = new DailyRotateFile({
  filename: 'backend_%DATE%',
  zippedArchive: false,
  maxSize: '100m',
  datePattern: 'YYYY-MM-DD',
  dirname: '/var/innova-ti/backend/logs/',
  //maxFiles: '24d',
  frequency: '24h',
  extension: '.log',
})

transport.on('rotate', function (oldFilename, newFilename) {
  oldFilename = oldFilename
  newFilename = newFilename
  // do something fun
})

const logger = winston.createLogger({
  level: (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({ format: timezoned }),
    winston.format.printf(info => `[${info.timestamp}] - ${info.level} - ${info.service} - ${info.message}`),
    winston.format.printf(error => `[${error.timestamp}] - ${error.level} - ${error.service} - ${error.message}`)
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    transport,
  ]})

/*const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: '/var/innova-ti/backend/logs/backend_' +
       DateTime.now().setZone('America/Santiago').toISODate() + '.log',
      maxsize: 5120000,
      maxFiles: 100,
      level: 'debug',
    }),
    /*new winston.transports.File({
      filename: '${__dirname}/../logs/debug-test.log',
      level: 'error',
    }),*/
//  ],
//})

/*if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}*/

export default logger
