
import winston from 'winston';
import path from 'path';

// Define log file location
const logDirectory = path.join(process.cwd(), 'logs');

// Configure Winston
const logger = winston.createLogger({

    // Minimum logging level
    level: 'debug', //Ignores silly

    // Log message format
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),

        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),

    // Define transports, Appenders
    transports: [

        // Display logs in terminal
        new winston.transports.Console(),

        // Store all logs in combined.log
        new winston.transports.File({
            filename: path.join(logDirectory, 'combined.log')
        }),

        // Store only error logs
        new winston.transports.File({
            filename: path.join(logDirectory, 'error.log'),
            level: 'error'
        })
    ]
});

export default logger;
