import bootstrap from '../component/bootstrap';
import db from '../component/db';
import secretKey from '../component/secretKey';
import accessAction from '../action/access';

export let user;

before(async function() {
  await secretKey.init();
  bootstrap.events();
  user = await accessAction.register({
    email: 'test1@mail.com',
    password: 'testAdmin',
    firstName: 'testAdmin',
    lastName: 'testAdmin',
  });
});


after(function(done) {
  db.drop(()=>{
    done();
  })
});
