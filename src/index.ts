import Koa from 'koa';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import fs from 'fs';

// import middlewares
import { bodyParserMiddleware } from './middleware/bodyParserMiddleware';
import { corsMiddleware } from './middleware/corsMiddleware';
import { jwtMiddleware } from './middleware/jwtMiddleware';

// import routes
import mainRoutes from './routes/main';
import testRoutes from './routes/test';
import loginRoutes from './routes/login';

// import models
import User from './model/User';
import Device from './model/Device';
import Repository from './model/Repository';
import File from './model/File';

// config dotenv
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  encoding: 'utf8',
  debug: false,
}).parsed;

// config https certificate
interface PemOptions {
  key: Buffer;
  cert: Buffer;
}

const options: PemOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

// handle exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (reason, exception) => {
  console.error('Unhandled Rejection at:', exception, 'reason:', reason);
});

// initialize mongodb
const connInfo = process.env.MONGODB_URI || '';
mongoose.set('strictQuery', true);
mongoose.connect(connInfo);

// generate demo records into db
// const initId = Date.now();
// bcrypt.genSalt(10, (err, salt) => {
//   if (err) throw err;
//   bcrypt.hash('123Qwe,./', salt, (err, hash) => {
//     if (err) throw err;
//     new User({
//       userId: initId,
//       username: 'sasha',
//       password: hash,
//       devices: [initId],
//       repository: [],
//     }).save();
//     new Device({
//       deviceId: initId,
//       deviceName: 'WUJIE-14',
//       macAddress: '4c:d5:77:07:91:ef',
//       belongTo: initId,
//     }).save();
//   });
// });
// new Repository({
//   repoId: initId,
//   repoName: 'demo repository',
//   belongTo: initId,
//   files: [initId],
// }).save();
// new File({
//   fileId: initId,
//   fileName: 'demo_file.txt',
//   md5: 'v9ahf8f3j8',
//   belongTo: initId,
//   chunk: [],
// }).save();

const app: Koa = new Koa();

// middleware
app.use(bodyParserMiddleware);
app.use(corsMiddleware);
app.use(jwtMiddleware);

// routes
app.use(mainRoutes.routes()).use(mainRoutes.allowedMethods());
app.use(testRoutes.routes()).use(testRoutes.allowedMethods());
app.use(loginRoutes.routes()).use(loginRoutes.allowedMethods());

const PORT = process.env.PORT;
// https.createServer(options, app.callback()).listen(PORT, () => console.log(`https://localhost:${PORT}`));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
