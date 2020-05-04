const winston = require('winston')

module.exports = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: winston.format.combine(
        winston.format.timestamp({
            timestamp: "YYYY-MM-DD HH:ii:ss.SSS"
        }),
        winston.format.colorize(),
        winston.format.printf(e => `[${e.timestamp}] ${e.level}: ${e.message}`)),
    transports: [ new winston.transports.Console() ]
})
