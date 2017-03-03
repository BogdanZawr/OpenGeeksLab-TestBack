import authorization  from "../action/authorization";
import koaRouter from 'koa-router';

export let router = koaRouter({
  prefix: '/api/v1/auth'
});

router.get('/getPublicKey', function *(next)  {
  yield authorization.getPublicKey(this);
  yield next;
});

router.post('/setPassword', function *(next)  {
  yield authorization.setPassword(this);
  yield next;
});
