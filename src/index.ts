/**
 * Main entry point of the server application.
 * It imports necessary modules, sets up middleware, connects to MongoDB,
 * generates demo records if none exists (dev env only), and starts the server.
 */

import Koa from "koa";
import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import winston from "winston";

/* import middlewares */
import { bodyParserMiddleware } from "./middleware/bodyParserMiddleware";
import { corsMiddleware } from "./middleware/corsMiddleware";

/* import routes */
import mainRoutes from "./routes/main";
import testRoutes from "./routes/test";
import UserRoutes from "./routes/user";

/* import models */
import User from "./model/User";
import Device from "./model/Device";

enum EENV {
    DEV = "dev",
    PROD = "prod",
}

/* handle exceptions */
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (reason, exception) => {
    console.error("Unhandled Rejection at:", exception, "reason:", reason);
});

/* config and load env variables from dotenv */
dotenv.config({
    path: path.resolve(__dirname, "../.env"),
    encoding: "utf8",
    debug: false,
}).parsed;

const {
    ENV,
    PORT,
    LOG_FILE,
    // API_HOST,
    // SECRET,
    MONGODB_URI,
    DEV_USER_NAME,
    DEV_HOST_NAME,
    DEV_HOST_MAC,
    DEV_HOST_PWD,
} = process.env;

/**
 * Create logger instance for logging application events.
 * Override console stdout methods to use the logger.
 */
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: LOG_FILE ?? "env.err.log" }),
    ],
});
console.log = (msg, ...opts) => logger.info(msg, ...opts);
console.warn = (msg, ...opts) => logger.warn(msg, ...opts);
console.error = (msg, ...opts) => logger.error(msg, ...opts);

const START_TIME = Date.now();
console.log(`Server started at ${new Date(START_TIME).toLocaleString()}`);

/**
 * Connects to MongoDB using the provided connection string.
 * Sets "strictQuery" option to true.
 * Logs a success / error message regarding if connection is successful.
 */
(async () => {
    const connInfo = MONGODB_URI ?? "";
    mongoose.set("strictQuery", true);
    try {
        await mongoose.connect(connInfo);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
})();

/**
 * Generates demo records in the database if no user exists.
 * Creates a default user with a hashed password and a device.
 */
(async () => {
    const userCount = await User.countDocuments();
    if (ENV === EENV.DEV && userCount === 0) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(DEV_HOST_PWD ?? "DEV_HOST_PWD", salt, (err, hash) => {
                if (err) throw err;
                new User({
                    userId: START_TIME,
                    username: DEV_USER_NAME ?? "DEV_USER_NAME",
                    password: hash,
                    devices: [START_TIME],
                    repository: [],
                }).save();
                new Device({
                    deviceId: START_TIME,
                    deviceName: DEV_HOST_NAME ?? "DEV_HOST_NAME",
                    macAddress: DEV_HOST_MAC ?? "DEV_HOST_MAC",
                    belongTo: START_TIME,
                }).save();
            });
        });
        console.log(`Generated demo records. id:${START_TIME}`);
        console.log(`Demo user: mac:${DEV_HOST_MAC} pwd:${DEV_HOST_PWD}`);
    }
})();

const app: Koa = new Koa();

/* register middlewares */
app.use(bodyParserMiddleware);
app.use(corsMiddleware);

/* register routes */
app.use(mainRoutes.routes()).use(mainRoutes.allowedMethods());
app.use(testRoutes.routes()).use(testRoutes.allowedMethods());
app.use(UserRoutes.routes()).use(UserRoutes.allowedMethods());

app.listen(PORT, () =>
    console.log(`Server running at: 'http://localhost:${PORT}'`),
);
