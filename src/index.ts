/**
 * Main entry point of the server application.
 * It imports necessary modules, sets up middleware, connects to MongoDB,
 * generates demo records if none exists, and starts the server.
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

/* handle exceptions */
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (reason, exception) => {
    console.error("Unhandled Rejection at:", exception, "reason:", reason);
});

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
        new winston.transports.File({ filename: "app.log" }),
    ],
});
console.log = (msg, ...opts) => logger.info(msg, ...opts);
console.warn = (msg, ...opts) => logger.warn(msg, ...opts);
console.error = (msg, ...opts) => logger.error(msg, ...opts);

/* config dotenv */
dotenv.config({
    path: path.resolve(__dirname, "../.env"),
    encoding: "utf8",
    debug: false,
}).parsed;

/**
 * Connects to MongoDB using the provided connection string.
 * Sets "strictQuery" option to true.
 * Logs a success / error message regarding if connection is successful.
 */
const connectToMongoDB = async () => {
    const connInfo = process.env.MONGODB_URI || "";
    mongoose.set("strictQuery", true);
    try {
        await mongoose.connect(connInfo);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
};

connectToMongoDB();

/**
 * Generates demo records in the database if no user exists.
 * Creates a default user with a hashed password and a device.
 */
const createDefaultUserIfNoneExists = async () => {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        const initId = Date.now();
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash("Asdf1234.", salt, (err, hash) => {
                if (err) throw err;
                new User({
                    userId: initId,
                    username: "sasha",
                    password: hash,
                    devices: [initId],
                    repository: [],
                }).save();
                new Device({
                    deviceId: initId,
                    deviceName: process.env.DEV_HOST_NAME,
                    macAddress: process.env.DEV_HOST_MAC,
                    belongTo: initId,
                }).save();
            });
        });
    }
};

createDefaultUserIfNoneExists();

const app: Koa = new Koa();

/* register middlewares */
app.use(bodyParserMiddleware);
app.use(corsMiddleware);

/* register routes */
app.use(mainRoutes.routes()).use(mainRoutes.allowedMethods());
app.use(testRoutes.routes()).use(testRoutes.allowedMethods());
app.use(UserRoutes.routes()).use(UserRoutes.allowedMethods());

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
