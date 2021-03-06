import koaRouter from 'koa-router';

import categoryValidate from '../validator/category'
import categoryAction from '../action/category';
import { bearerMiddleware, rolesCheck } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/category',
});

router.all('/*', bearerMiddleware);

/**
  * @apiDefine categoryObject
  * @apiSuccess  {String} _id Category id
  * @apiSuccess  {Boolean} isDeleted Is this category removed
  * @apiSuccess  {String} title Title of category
  * @apiSuccess  {String} categoryId Id parent category of this category
  * @apiSuccess  {String} createdAt Category create date
  * @apiSuccess  {String} updatedAt Category update date
*/

/**
  * @apiName GetaAllCategooryes
  * @api {GET} /api/v1/category/all GetAll

  * @apiVersion 0.0.1

  * @apiGroup Category

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/category/all'
  *      -H "Content-Type: application/json"
  *      -X GET

  * @apiSuccessExample {json} Success-Response:
  {
    [
      "createdAt": "2017-05-17T08:41:41.510Z",
      "updatedAt": "2017-05-17T08:41:41.510Z",
      "isDeleted": false,
      "_id": "591c0cc5407eba1706aeb43e",
      "title": "title",
      "categoryId": "5bea7f2a2a676b09b88fc5f4",
    ]
  }
  * @apiUse categoryObject
*/

router.get('/all', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    rolesCheck('recipeRead', req.request.user);
    await categoryAction.getAll();
  });
});

/**
  * @apiName CreateCategory
  * @api {POST} /api/v1/category/create Create

  * @apiVersion 0.0.1

  * @apiGroup Category

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} text Text
  * @apiParam  {String} [categoryId] Id of parent category

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/category/create'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{
  *     "title":"text"
  *   }'

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": false,
    "_id": "591c0cc5407eba1706aeb43e",
    "title": "title",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  * @apiUse categoryObject

  * @apiError {Object} TitleRequired { param: "category", message: "Title is required" }
  * @apiError {Object} ParentIdNotFound { param: "category", message: "Parent id not found" }
  * @apiError {Object} ParentIdIsNotMongoId { param: "category", message: "categoryId is not mongoId" }
*/

router.post('/create', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    rolesCheck('recipeCreate', req.request.user);
    const reqData = await categoryValidate.create(req.request.body);
    return categoryAction.create(reqData);
  });
});

/**
  * @apiName DeleteCategory
  * @api {DELETE} /api/v1/category/delete/:id Delete

  * @apiVersion 0.0.1

  * @apiGroup Category

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} _id Id of category

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/category/delete/591c0cc5407eba1706aeb43e'
  *      -H "Content-Type: application/json"
  *      -X DELETE

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": true,
    "_id": "591c0cc5407eba1706aeb43e",
    "title": "title",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  * @apiUse categoryObject


  * @apiError {Object} IdNotFound { param: "category", message: "CategoryId not found" }
  * @apiError {Object} IdIsNotMongoId { param: "category", message: "Parent id not found" }
*/

router.delete('/delete/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    rolesCheck('recipeDelete', req.request.user);
    const reqData = await categoryValidate.delete(req.params.id);
    return categoryAction.delete(reqData);
  });
});

/**
  * @apiName UpdateCategory
  * @api {POST} /api/v1/category/update Update

  * @apiVersion 0.0.1

  * @apiGroup Category

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} [text] Text
  * @apiParam  {String} [categoryId] Id of parent category
  * @apiParam  {String} _id Id of category


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/category/update'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{
  *     "title":"text",
  *     "_id":"591c0cc5407eba1706aeb43e"
  *   }'

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:42:12.240a",
    "isDeleted": false,
    "_id": "591c0cc5407eba1706aeb43e",
    "title": "title",
    "categoryId": "5bea7f2a2a676b09b88fc5f4",
  }
  * @apiUse categoryObject

  * @apiError {Object} TitleRequired { param: "category", message: "Title is required" }
  * @apiError {Object} IdNotFound { param: "category", message: "category not found" }
  * @apiError {Object} IdIsNotMongoId { param: "category", message: "Id is not mongoId" }
  * @apiError {Object} CategoryCanNotBeHimSelfParent { param: "category", message: "You cannot make a parent of the category of the same category" }
  * @apiError {Object} CategoryCanNotBeHimSelfChild { param: "category", message: "You cannot make a parent of a category out of a child of this category" }
  * @apiError {Object} IdRequired { param: "category", message: "_id is required" }
  * @apiError {Object} ParentIdNotFound { param: "category", message: "Parent id not found" }
*/

router.put('/update', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    rolesCheck('recipeUpdate', req.request.user);
    const reqData = await categoryValidate.update(req.request.body);
    return categoryAction.update(reqData);
  });
});

/**
  * @apiName CategoryList
  * @api {GET} /api/v1/category/categoryList/:id CategoryList

  * @apiVersion 0.0.1

  * @apiGroup Category

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} categoryId Id of category

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/category/categoryList/5bea7f2a2a676b09b88fc5f4'
  *      -H "Content-Type: application/json"
  *      -X GET

  * @apiSuccessExample {json} Success-Response:
  {
    [
      "createdAt": "2017-05-17T08:41:41.510Z",
      "updatedAt": "2017-05-17T08:41:41.510Z",
      "isDeleted": false,
      "_id": "591c0cc5407eba1706aeb43e",
      "title": "title",
      "categoryId": "5bea7f2a2a676b09b88fc5f4",
    ]
  }
  * @apiUse categoryObject

  * @apiError {Object} IdIsNotMongoId { param: "category", message: "_id is not mongoId" }
  * @apiError {Object} CategoryNotFound { param: "category", message: "Category not found" }
*/

router.get('/categoryList/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    rolesCheck('recipeRead', req.request.user);
    const reqData = await categoryValidate.categoryList(req.params.id);
    return categoryAction.getCategoryList(reqData);
  });
});

/**
  * @apiName FullInfo
  * @api {GET} /api/v1/category/fullInfo/:id Full Info

  * @apiVersion 0.0.1

  * @apiGroup Category

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} categoryId Id of category

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:8000/api/v1/category/fullInfo/5bea7f2a2a676b09b88fc5f4'
  *      -H "Content-Type: application/json"
  *      -X GET

  * @apiSuccessExample {json} Success-Response:
  [
    {
        "_id": "5c0677ce2a9b843ecb6667ad",
        "isDeleted": false,
        "title": "title",
        "categoryId": "5c0677cb2a9b843ecb6667ab",
        "createdAt": "2018-12-04T12:49:18.175Z",
        "updatedAt": "2018-12-04T12:49:18.175Z",
        "__v": 0,
        "articles": [
            {
                "_id": "5c0677da2a9b843ecb6667b1",
                "isDeleted": false,
                "title": "title2",
                "description": "text",
                "text": "text",
                "categoryId": "5c0677ce2a9b843ecb6667ad",
                "createdAt": "2018-12-04T12:49:30.963Z",
                "updatedAt": "2018-12-04T12:49:30.963Z",
                "__v": 0
            }
        ],
        "recipes": [
            {
                "_id": "5c0677d52a9b843ecb6667af",
                "isDeleted": false,
                "title": "title2",
                "text": "text",
                "categoryId": "5c0677ce2a9b843ecb6667ad",
                "createdAt": "2018-12-04T12:49:25.761Z",
                "updatedAt": "2018-12-04T12:49:25.761Z",
                "__v": 0
            }
        ]
    }
]
  * @apiUse categoryObject

  * @apiError {Object} IdIsNotMongoId { param: "category", message: "_id is not mongoId" }
  * @apiError {Object} CategoryNotFound { param: "category", message: "Category not found" }
*/

router.get('/fullInfo/:id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    rolesCheck('recipeRead', req.request.user);
    return categoryAction.categoryFullInfo(req.params.id);
  });
});
