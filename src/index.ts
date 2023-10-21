import Koa from 'koa';
import path from 'path';
// import https from 'https';
import dotenv from 'dotenv';
// import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import fs from 'fs';
// import multer from 'koa-multer'

import { bodyParserMiddleware } from './middleware/bodyParserMiddleware';
import { corsMiddleware } from './middleware/corsMiddleware';

import mainRoutes from './routes/main';
import testRoutes from './routes/test';
import loginRoutes from './routes/login';

import Device from './model/Device';
import User from './model/User';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  encoding: 'utf8',
  debug: false,
}).parsed;

interface PemOptions {
  key: Buffer;
  cert: Buffer;
}

const options: PemOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (reason, exception) => {
  console.error('Unhandled Rejection at:', exception, 'reason:', reason);
});

const connInfo = process.env.MONGODB_URI || '';
mongoose.set('strictQuery', true);
mongoose.connect(connInfo);

// bcrypt.genSalt(10, (err, salt) => {
//   if (err) throw err;
//   bcrypt.hash('123Qwe,./', salt, (err, hash) => {
//     if (err) throw err;
//     const initId = Date.now();
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

const app: Koa = new Koa();

// middleware
app.use(bodyParserMiddleware);
app.use(corsMiddleware);

// routes
app.use(mainRoutes.routes()).use(mainRoutes.allowedMethods());
app.use(testRoutes.routes()).use(testRoutes.allowedMethods());
app.use(loginRoutes.routes()).use(loginRoutes.allowedMethods());

const PORT = process.env.PORT;
// https.createServer(options, app.callback()).listen(PORT, () => console.log(`https://localhost:${PORT}`));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
