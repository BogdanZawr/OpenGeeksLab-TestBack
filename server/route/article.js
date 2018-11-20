import koaRouter from 'koa-router';

import articleValidate from '../validator/article';
import articleAction from '../action/article';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/article',
});

/**
  * @apiDefine articleObject
  * @apiSuccess  {String} _id Aticle id
  * @apiSuccess  {String} title Title of article
  * @apiSuccess  {String} text Text of article
  * @apiSuccess  {String} description Description of articles
  * @apiSuccess  {String} categoryId Id parent category of this article
  * @apiSuccess  {Boolean} isDeleted Is this article removed
  * @apiSuccess  {String} createdAt Category create date
  * @apiSuccess  {String} updatedAt Category update date
*/

/**
  * @apiName GetArticle
  * @api {GET} /api/v1/article/item/:id GetItem

  * @apiVersion 0.0.1

  * @apiGroup Article

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} _id Article id

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/article/item/591c0cc5407eba1706aeb43e'
  *      -H "Content-Type: application/json"
  *      -X GET


  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": false,
    "_id": "591c0cc5407eba1706aeb43e",
    "title":"text",
    "description": "text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  * @apiUse articleObject

  * @apiError {Object} ArticleNotFound { param: "category", message: "article not found" }
  * @apiError {Object} ArticleIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
*/

router.get('/item/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, () => articleValidate.getItem(req.params.id));
});

/**
  * @apiName CreateArticle
  * @api {POST} /api/v1/article/create Create

  * @apiVersion 0.0.1

  * @apiGroup Article

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} text Text
  * @apiParam  {String} categoryId Id of parent category
  * @apiParam  {String} title Text
  * @apiParam  {String} description Text


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/article/create'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{
  *     "title":"text",
  *     "description": "text",
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
    "description": "text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  * @apiUse articleObject

  * @apiError {Object} TitleRequired { param: "category", message: "Title is required" }
  * @apiError {Object} TextRequired { param: "category", message: "text is required" }
  * @apiError {Object} DescriptionRequired { param: "category", message: "description is required" }
  * @apiError {Object} ParentIdNotFound { param: "category", message: "category not found" }
  * @apiError {Object} ParentIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
*/

router.post('/create', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await articleValidate.create(req.request.body);
    return articleAction.create(reqData);
  });
});

/**
  * @apiName DeleteArticle
  * @api {DELETE} /api/v1/article/delete/:id Delete

  * @apiVersion 0.0.1

  * @apiGroup Article

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} _id Article id

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/article/delete/591c0cc5407eba1706aeb43e'
  *      -H "Content-Type: application/json"
  *      -X DELETE


  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": true,
    "_id": "591c0cc5407eba1706aeb43e",
    "title":"text",
    "description": "text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  * @apiUse articleObject

  * @apiError {Object} ArticleNotFound { param: "category", message: "article not found" }
  * @apiError {Object} ArticleIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
*/

router.delete('/delete/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const _id = await articleValidate.delete(req.params.id);
    return articleAction.delete(_id);
  });
});

/**
  * @apiName UpdateArticle
  * @api {PUT} /api/v1/article/update Update

  * @apiVersion 0.0.1

  * @apiGroup Article

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} [text] Text
  * @apiParam  {String} [categoryId] Id of parent category
  * @apiParam  {String} [title] Text
  * @apiParam  {String} [description] Text
  * @apiParam  {String} _id Article id


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/article/update'
  *      -H "Content-Type: application/json"
  *      -X PUT
  *      -d  '{
  *     "title":"text",
  *     "description": "text",
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
    "description": "text",
    "text":"text",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  * @apiUse articleObject

  * @apiError {Object} TitleRequired { param: "category", message: "Title is required" }
  * @apiError {Object} TextRequired { param: "category", message: "text is required" }
  * @apiError {Object} DescriptionRequired { param: "category", message: "description is required" }
  * @apiError {Object} ParentIdNotFound { param: "category", message: "category not found" }
  * @apiError {Object} ParentIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
*/

router.put('/update', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await articleValidate.update(req.request.body);
    return articleAction.update(reqData);
  });
});

/**
  * @apiName CategoryList
  * @api {GET} /api/v1/article/categoryList/:id CategoryList

  * @apiVersion 0.0.1

  * @apiGroup Article

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} categoryId Id of category


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/article/categoryList/5bea7f2a2a676b09b88fc5f4'
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

  * @apiError {Object} ArticleIdIsNotMongoId { param: "category", message: "articleId is not mongoId" }
  * @apiError {Object} ArticleNotFound { param: "category", message: "article not found" }
*/

router.get('/categoryList/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await articleValidate.categoryList(req.params.id);
    return articleAction.getCategoryList(reqData);
  });
});

/**
  * @apiName ArticleByCategory
  * @api {GET} /api/v1/article/byCategory/:id ArticleByCategory

  * @apiVersion 0.0.1

  * @apiGroup Article

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} categoryId Id of category


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/article/byCategory/5bea7f2a2a676b09b88fc5f4'
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
      "description": "text"
      "categoryId": "5bea7f2a2a676b09b88fc5f4",
    ]
  }
  * @apiUse articleObject

  * @apiError {Object} CategoryIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
  * @apiError {Object} CategoryNotFound { param: "category", message: "Category not found" }
*/

router.get('/byCategory/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await articleValidate.byCategory(req.params.id);
    return articleAction.byCategory(reqData);
  });
});
