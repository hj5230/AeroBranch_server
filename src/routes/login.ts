import Router from 'koa-router';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../model/User';
import Device from '../model/Device';

const router = new Router({ prefix: '/login' });

router.get('/verify_mac/:macaddr', async (ctx) => {
  const { macaddr } = ctx.params;
  const device = await Device.findOne({ macAddress: macaddr });
  ctx.body = { macOk: !!device };
});

interface SignBody {
  macAddr: string;
  password: string;
}

router.post('/sign', async (ctx) => {
  const { macAddr, password } = ctx.request.body as SignBody;
  const user = await User.findOne({ macAddr: macAddr });
  if (!user) ctx.body = { errno: 'USRNF' };
  else {
    if (bcrypt.compareSync(password, user.password)) {
      const payload = {
        userId: user.userId,
        username: user.username
      }
      const secretKey = process.env.SECRET || 'AEROBRANCHSECRET@2023'
      const token = jwt.sign(payload, secretKey, { expiresIn: '2h' })
      ctx.body = { token };
    } else {
      ctx.body = { errno: 'PWDNM' };
    }
  }
});

export default router;
