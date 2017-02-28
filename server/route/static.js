import send from 'koa-send';
import path from 'path';
import koaRouter from 'koa-router';

export let router = koaRouter({
  prefix: '/'
});

router.get('*', function *(next) {
  yield send(this, path.join(__dirname, '/../client/index.html'));
  yield next;
});
