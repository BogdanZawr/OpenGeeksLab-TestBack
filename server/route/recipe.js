import koaRouter from 'koa-router';

import recipeValidate from '../validator/recipe'
import recipeAction from '../action/recipe';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/recipe',
});

/**
  * @apiDefine recipeObject
  * @apiSuccess  {String} _id Recipe id
  * @apiSuccess  {String} title Title of recipe
  * @apiSuccess  {String} text Text of recipe
  * @apiSuccess  {String} categoryId Id parent category of this recipe
  * @apiSuccess  {Boolean} isDeleted Is this recipe removed
  * @apiSuccess  {String} createdAt Category create date
  * @apiSuccess  {String} updatedAt Category update date
*/

/**
  * @apiName GetRecipe
  * @api {GET} /api/v1/recipe/item/:id GetItem

  * @apiVersion 0.0.1

  * @apiGroup Recipe

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} _id Recipe id

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/recipe/item/591c0cc5407eba1706aeb43e'
  *      -H "Content-Type: application/json"
  *      -X GET


  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": false,
    "_id": "591c0cc5407eba1706aeb43e",
    "title":"text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  @apiUse recipeObject

  * @apiError {Object} RecipeNotFound { param: "category", message: "recipe not found" }
  * @apiError {Object} RecipeIdIsNotMongoId { param: "category", message: "recipeId is not mongoId" }
*/

router.get('/item/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, () => recipeValidate.getItem(req.params.id));
});

/**
  * @apiName CreateRecipe
  * @api {POST} /api/v1/recipe/create Create

  * @apiVersion 0.0.1

  * @apiGroup Recipe

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} text Text
  * @apiParam  {String} categoryId Id of parent category
  * @apiParam  {String} title Text


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/recipe/create'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{
  *     "title":"text",
  *     "text":"text",
  *     "categoryId":"5bea7f2a2a676b09b88fc5f4"
  *   }'

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": false,
    "_id": "591c0cc5407eba1706aeb43e",
    "title":"text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  @apiUse recipeObject

  * @apiError {Object} TitleRequired { param: "category", message: "Title is required" }
  * @apiError {Object} TextRequired { param: "category", message: "text is required" }
  * @apiError {Object} CategoryIdNotFound { param: "category", message: "category not found" }
  * @apiError {Object} CategoryIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
*/

router.post('/create', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await recipeValidate.create(req.request.body);
    return recipeAction.create(reqData);
  });
});

/**
  * @apiName DeleteRecipe
  * @api {DELETE} /api/v1/recipe/delete/:id Delete

  * @apiVersion 0.0.1

  * @apiGroup Recipe

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} _id Recipe id

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/recipe/delete/591c0cc5407eba1706aeb43e'
  *      -H "Content-Type: application/json"
  *      -X DELETE


  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": true,
    "_id": "591c0cc5407eba1706aeb43e",
    "title":"text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  @apiUse recipeObject

  * @apiError {Object} RecipeNotFound { param: "category", message: "recipe not found" }
  * @apiError {Object} RecipeIdIsNotMongoId { param: "category", message: "recipeId is not mongoId" }
*/

router.delete('/delete/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const _id = await recipeValidate.delete(req.params.id);
    return recipeAction.delete(_id);
  });
});

/**
  * @apiName UpdateRecipe
  * @api {PUT} /api/v1/recipe/update Update

  * @apiVersion 0.0.1

  * @apiGroup Recipe

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} [text] Text
  * @apiParam  {String} [categoryId] Id of parent category
  * @apiParam  {String} [title] Text
  * @apiParam  {String} _id Recipe id


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/recipe/update'
  *      -H "Content-Type: application/json"
  *      -X PUT
  *      -d  '{
  *     "title":"text",
  *     "text":"text",
  *     "categoryId":"5bea7f2a2a676b09b88fc5f4"
  *     "_id":"591c0cc5407eba1706aeb43e"
  *   }'

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-19T12:55:23.140Y",
    "isDeleted": false,
    "_id": "591c0cc5407eba1706aeb43e",
    "title":"text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  @apiUse recipeObject

  * @apiError {Object} TitleRequired { param: "category", message: "Title is required" }
  * @apiError {Object} TextRequired { param: "category", message: "text is required" }
  * @apiError {Object} ParentIdNotFound { param: "category", message: "category not found" }
  * @apiError {Object} ParentIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
*/

router.put('/update', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await recipeValidate.update(req.request.body);
    return recipeAction.update(reqData);
  });
});

/**
  * @apiName CategoryList
  * @api {GET} /api/v1/recipe/categoryList/:id CategoryList

  * @apiVersion 0.0.1

  * @apiGroup Recipe

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} categoryId Id of category


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/recipe/categoryList/5bea7f2a2a676b09b88fc5f4'
  *      -H "Content-Type: application/json"
  *      -X GET

  * @apiSuccessExample {json} Success-Response:
  {
    [
      "createdAt": "2017-05-17T08:41:41.510Z",
      "updatedAt": "2017-05-17T08:41:41.510Z",
      "isDeleted": false,
      "_id": "591c0cc5407eba1706aeb43e",
      "title": "text",
      "categoryId": "5bea7f2a2a676b09b88fc5f4",
    ]
  }

  * @apiSuccess  {String} _id Category id
  * @apiSuccess  {Boolean} isDeleted Is this category removed
  * @apiSuccess  {String} title Title of category
  * @apiSuccess  {String} categoryId Id parent category of this category
  * @apiSuccess  {String} createdAt Category create date
  * @apiSuccess  {String} updatedAt Category update date

  * @apiError {Object} RecipeIdIsNotMongoId { param: "category", message: "recipeId is not mongoId" }
  * @apiError {Object} RecipeNotFound { param: "category", message: "recipe not found" }
*/

router.get('/categoryList/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await recipeValidate.categoryList(req.params.id);
    return recipeAction.getCategoryList(reqData);
  });
});

/**
  * @apiName RecipeByCategory
  * @api {GET} /api/v1/recipe/byCategory/:id RecipeByCategory

  * @apiVersion 0.0.1

  * @apiGroup Recipe

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} categoryId Id of category


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/recipe/byCategory/5bea7f2a2a676b09b88fc5f4'
  *      -H "Content-Type: application/json"
  *      -X GET

  * @apiSuccessExample {json} Success-Response:
  {
    [
      "createdAt": "2017-05-17T08:41:41.510Z",
      "updatedAt": "2017-05-17T08:41:41.510Z",
      "isDeleted": false,
      "_id": "591c0cc5407eba1706aeb43e",
      "title": "text",
      "text": "text"
      "categoryId": "5bea7f2a2a676b09b88fc5f4",
    ]
  }
  @apiUse recipeObject

  * @apiError {Object} CategoryIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
  * @apiError {Object} CategoryNotFound { param: "category", message: "Category not found" }
*/

router.get('/byCategory/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await recipeValidate.byCategory(req.params.id);
    return recipeAction.byCategory(reqData);
  });
});
