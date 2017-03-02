import {testWrite}  from "../model/write/test";

import {eventBus}  from '../component/eventBus';

class Test {
  * testEventGen  (data) {
    console.log(data);
    try {
      let t = yield testWrite.findRows({
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
      let t = await testWrite.aggregateWithOptions({
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
      t = yield testWrite.aggregateWithOptions({
        query:[],
        options: {
          limit: 2,
          pageNumber: 0
        }
      });

      // t = yield testWrite.insertRow({
      //   data:{
      //     "name": router.request.body.name,
      //     "updatedAt": new Date("2017-02-28T09:06:21.422Z"),
      //     "createdAt": new Date("2017-02-28T09:06:21.422Z")
      //   }
      // });
    }
    catch (err) {
      router.body = err;
      router.status = 400;
      return;
    }

    eventBus.emit('eventTestAsync', t);

    router.body = t;
  }

  testRouterFun  (router) {
    router.body = 'testu';
    eventBus.emit('eventTestFun');
  }

}

export let test = new Test();