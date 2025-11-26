import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: path.join(logsDir, 'error.log'), 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: path.join(logsDir, 'combined.log') 
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

const loggingMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            userAgent: req.get('User-Agent'),
            ip: req.ip
        };

        logger.info('HTTP Request', logData);

        if (res.statusCode >= 400) {
            logger.error('HTTP Error', logData);
        }
    });

    next();
};

export default loggingMiddleware;