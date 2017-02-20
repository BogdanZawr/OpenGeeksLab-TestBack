import {TestWrite}  from "../model/write/test";

export class Test {
  async test  (router, next) {

    let t;
    try {
      t = await TestWrite.findRows({});
    }
    catch (err) {
      router.body = 'error';
      router.status = 400;
      return;
    }
    console.log (t);
    router.body = 'Hello World';
  }
}

