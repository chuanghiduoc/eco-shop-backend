const { createLogger, format, transports } = require("winston");
const path = require("path");

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(i => `${i.level}: ${i.timestamp}: ${i.message}`)
    ),
    transports: [
        new transports.File({
            filename: path.join(__dirname, "../logs/silly.log"),
            level: "silly",
            format: format.combine(
                format.printf(i => (i.level === "silly" ? `${i.level}: ${i.timestamp} ${i.message}` : ""))
            ),
        }),
        new transports.File({
            filename: path.join(__dirname, "../logs/info.log"),
            level: "info",
            format: format.combine(
                format.printf(i => (i.level === "info" ? `${i.level}: ${i.timestamp} ${i.message}` : ""))
            ),
        }),
        new transports.File({
            filename: path.join(__dirname, "../logs/error.log"),
            level: "error",
        }),
    ],
});

module.exports = logger;
