import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'Welcome to AeroBranch-server!';
});

export default router;
