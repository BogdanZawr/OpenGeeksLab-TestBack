import {TestWrite}  from "../model/write/test";

import {EventBus}  from '../component/EventBus';

export class Test {
  * testEventGen  (data) {
    console.log(data);
    try {
      let t = yield TestWrite.findRows({
        query:{}
      });

      console.log(t);
    }
    catch (err) {
      console.log(err);
      return;
    }
    return 2;
  }

  testEventFun  (data) {
    console.log('testEventFun');
  }

  async testEventAsync  (data) {
    console.log(data);
    try {
      let t = await TestWrite.aggregateWithOptions({
        query:[],
        options: {
          limit: 2,
          pageNumber: 0
        }
      });
      console.log(t);
    }
    catch (err) {
      console.log(err);
      return;
    }
  }



  * testRouterGen (router) {
    console.log(router.request.body);
    console.log(this.testM);

    router.checkBody('name').len(2, 20,"are you kidding me?");

    if (router.errors) {
        router.body = router.errors;
        router.status = 422;
        return;
    }

    let t;

    try {
      t = yield TestWrite.aggregateWithOptions({
        query:[],
        options: {
          limit: 2,
          pageNumber: 0
        }
      });}
    catch (err) {
      router.body = err;
      router.status = 400;
      return;
    }

    EventBus.emit('eventTestAsync', t);

    router.body = t;
  }

  testRouterFun  (router) {
    router.body = 'testu';
    EventBus.emit('eventTestFun');
  }

}

