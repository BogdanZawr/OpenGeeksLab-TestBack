import access  from "../action/access";
import {bearerMiddleware} from '../component/passport';
import koaRouter from 'koa-router';

export let router = koaRouter({
  prefix: '/api/v1/access'
});

router.post('/register', function *(next)  {
  yield access.register(this);
  yield next;
});

router.post('/login', function *(next)  {
  yield access.login(this);
  yield next;
});

router.post('/refreshToken', function *(next)  {
  yield access.refreshToken(this);
  yield next;
});



export let router2 = koaRouter({
  prefix: '/api/v1/authAccess'
});

router2.all('*', bearerMiddleware);

router2.get('/loginConfirm', function *(next)  {
  yield access.loginConfirm(this);
  yield next;
});