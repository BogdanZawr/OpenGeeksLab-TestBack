import bootstrap from '../component/bootstrap';
import db from '../component/db';
import secretKey from '../component/secretKey';
import accessAction from '../action/access';
import categoryAction from '../action/category';
import recipeAction from '../action/recipe';
import articleAction from '../action/article';


export let user;
export let category;
export let recipe;
export let article;

before(async function() {
  await secretKey.init();
  bootstrap.events();
  user = await accessAction.register({
    email: 'test1@mail.com',
    password: 'testAdmin',
    firstName: 'testAdmin',
    lastName: 'testAdmin',
  });

  category = await categoryAction.create({
    title: 'test',
    categoryId: null,
  });

  recipe = await recipeAction.create({
    title: 'test',
    text: 'test',
    categoryId: category._id
  })

  article = await articleAction.create({
    title: 'test',
    text: 'test',
    description: 'test',
    categoryId: category._id
  })
});


after(async function() {
  await db.drop();
});
