import {Test}  from "../action/test";
import koaRouter from 'koa-router';

let test = new Test();

export let router = koaRouter({
  prefix: '/r'
});

router.post('*', function *(next) {
  console.log ('r1');
  yield next;
  console.log ('r5');
});


router.post('/g', function *(next)  {

  console.log ('r2');
  yield test.testRouterGen(this);
  console.log ('r3');
  yield next;
  console.log ('r4');
});

router.post('/f', function *(next)  {

  console.log ('r2');
  test.testRouterFun(this);
  console.log ('r3');
  yield next;
  console.log ('r4');
});
