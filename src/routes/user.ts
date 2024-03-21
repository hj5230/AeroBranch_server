import Router from 'koa-router';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../model/User';
import Device from '../model/Device';

import { SignBody } from '../interface/Iuser';

const router = new Router({ prefix: '/user' });

const secretKey = process.env.SECRET || 'AEROBRANCHSECRET@2023';

router.get('/verify/:macAddr', async (ctx) => {
  const { macAddr } = ctx.params;
  const device = await Device.findOne({ macAddress: macAddr });
  ctx.body = { macOk: !!device };
});

router.post('/sign', async (ctx) => {
  const { macAddr, password } = ctx.request.body as SignBody;
  const user = await User.findOne({ macAddr: macAddr });
  if (!user) ctx.body = { errno: 'USRNF' }; // user not found
  else {
    if (bcrypt.compareSync(password, user.password)) {
      // password match
      const payload = {
        userId: user.userId,
        username: user.username,
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: '12h' });
      ctx.body = {
        token,
        username: user.username,
      };
    } else {
      ctx.body = { errno: 'PWDNM' }; // password not match
    }
  }
});

router.get('/verify', async (ctx) => {
  const { authorization } = ctx.headers;
  if (!authorization) {
    ctx.body = { errno: 'USRNL' };
    ctx.status = 401;
    return;
  }
  const token = authorization.split(' ')[1];
  const info = jwt.verify(token, secretKey);
  ctx.body = info;
});

export default router;
