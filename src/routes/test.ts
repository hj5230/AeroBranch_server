import Router from 'koa-router';
import Device from '../model/Device';

const router = new Router({ prefix: '/test' });

router.get('/', async (ctx) => {
  ctx.body = 'Welcome to Test';
});

export default router;
