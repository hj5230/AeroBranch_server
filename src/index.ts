import Koa from "koa";
import path from "path";
// import https from "https";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import fs from "fs";

// import middlewares
import { bodyParserMiddleware } from "./middleware/bodyParserMiddleware";
import { corsMiddleware } from "./middleware/corsMiddleware";
// import { jwtMiddleware } from "./middleware/jwtMiddleware";

// import routes
import mainRoutes from "./routes/main";
import testRoutes from "./routes/test";
import UserRoutes from "./routes/user";

// import models
import User from "./model/User";
import Device from "./model/Device";
// import Repository from './model/Repository';
// import File from './model/File';

// config dotenv
dotenv.config({
    path: path.resolve(__dirname, "../.env"),
    encoding: "utf8",
    debug: false,
}).parsed;

// config https certificate
// interface PemOptions {
//     key: Buffer;
//     cert: Buffer;
// }

// const options: PemOptions = {
//     key: fs.readFileSync("./key.pem"),
//     cert: fs.readFileSync("./cert.pem"),
// };

// handle exceptions
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (reason, exception) => {
    console.error("Unhandled Rejection at:", exception, "reason:", reason);
});

// initialize mongodb
const connInfo = process.env.MONGODB_URI || "";
mongoose.set("strictQuery", true);
mongoose
    .connect(connInfo)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));

// generate demo records into db
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
                    deviceName: "WUJIE-14",
                    macAddress: process.env.DEV_HOST_MAC,
                    belongTo: initId,
                }).save();
            });
        });
    }
};
createDefaultUserIfNoneExists();

const app: Koa = new Koa();

// middleware
app.use(bodyParserMiddleware);
app.use(corsMiddleware);
// app.use(jwtMiddleware);

// routes
app.use(mainRoutes.routes()).use(mainRoutes.allowedMethods());
app.use(testRoutes.routes()).use(testRoutes.allowedMethods());
app.use(UserRoutes.routes()).use(UserRoutes.allowedMethods());

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
// https.createServer(options, app.callback()).listen(PORT, () => console.log(`https://localhost:${PORT}`));
