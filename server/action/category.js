import * as _ from 'lodash';
import eventBus from '../component/eventBus';
import CategoryWrite from '../model/write/category';
import CategoryRead from '../model/read/category';
import RecipeWrite from '../model/write/recipe';
import ArticleWrite from '../model/write/article';
import BreadcrumsRead from '../model/read/breadcrums';

class CategoryAction {
  async tree(category) {
    const data = _.assignIn({}, category, { children: [] });

    data.childIds = {
      [category._id]: true,
    };

    if (!category.categoryId) {
      await CategoryRead.create(data);
    } else {
      const item = await CategoryRead.findByField(category.categoryId);
      let currentItem = item;

      while (!currentItem._id.equals(category.categoryId)) {
        currentItem.childIds[category._id] = true;

        for (let i = 0; i < currentItem.children.length; i++) {
          if (currentItem.children[i].childIds[category.categoryId]) {
            currentItem = currentItem.children[i];
            break;
          }
        }
        if (currentItem.children.length === 0) {
          break;
        }
      }

      currentItem.childIds[category._id] = true;
      currentItem.children.push(data);

      await CategoryRead.update(item, item._id);
    }
  }

  async treeRebuild({ category, _id, isDelete }) {
    const itemForFind = await CategoryRead.findByField(_id);
    let currentItem = itemForFind;
    const elementsToDeleteChildArrMask = currentItem.childIds;
    let deletedItemIndex = _.findIndex(currentItem.children, function(o) { return o._id.equals(_id)});
    const arrayElementsToUpdateChildIds = [currentItem.childIds];
    let toUpdateObj;
    let idsOfArr;

    if (!currentItem._id.equals(_id)) {
      while (deletedItemIndex === -1) {
        for (let i = 0; i < currentItem.children.length; i++) {
          if (currentItem.children[i].childIds[_id]) {
            currentItem = currentItem.children[i];
            arrayElementsToUpdateChildIds.push(currentItem.childIds);
            deletedItemIndex = _.findIndex(currentItem.children, function(o) { return o._id.equals(_id)});
            break;
          }
        }
        if (currentItem.children.length === 0) {
          break;
        }
      }

      arrayElementsToUpdateChildIds.push(currentItem.children[deletedItemIndex].childIds);
      _.assignIn(elementsToDeleteChildArrMask, currentItem.children[deletedItemIndex].childId);

      toUpdateObj = _.cloneDeep(currentItem.children[deletedItemIndex]);
      toUpdateObj.categoryId = category.categoryId;
      toUpdateObj.updatedAt = category.updatedAt;
      idsOfArr = _.cloneDeep(currentItem.children[deletedItemIndex].childIds);

      const deleteArr = Object.keys(idsOfArr);

      for (let j = 0; j < arrayElementsToUpdateChildIds.length; j++) {
        for (let i = 0; i < deleteArr.length; i++) {
          delete arrayElementsToUpdateChildIds[j][deleteArr[i]];
        }
      }

      const childrensOfDeleteItem = _.cloneDeep(currentItem.children[deletedItemIndex].children);

      currentItem.children.splice(deletedItemIndex, 1);

      if (isDelete) {
        for (let i = 0; i < childrensOfDeleteItem.length; i++) {
          childrensOfDeleteItem[i].updatedAt = category.updatedAt;
          childrensOfDeleteItem[i].categoryId = category.categoryId;
          currentItem.childIds[childrensOfDeleteItem[i]._id] = true;
        }
        currentItem.children = currentItem.children.concat(childrensOfDeleteItem);
      }

    } else {
      toUpdateObj = _.cloneDeep(currentItem);
      toUpdateObj.categoryId = category.categoryId;
      toUpdateObj.updatedAt = category.updatedAt;
      idsOfArr = _.cloneDeep(currentItem.childIds);

      if (isDelete) {
        const promise = currentItem.children.map((item) => {
          return CategoryRead.create(item);
        });

        await Promise.all(promise);
      }

      await CategoryRead.delete(_id);
    }

    if (!isDelete) {

      if (category.categoryId !== null) {
        let itemForUpdate;

        if (itemForFind.childIds[category.categoryId]) {
          itemForUpdate = itemForFind;
        } else {
          itemForUpdate = await CategoryRead.findByField(category.categoryId);
          if (!itemForFind._id.equals(_id)) {
            await CategoryRead.update(itemForFind, itemForFind._id);
          }
        }
        let currentItemForUpdate = itemForUpdate;
        const elementsToCreateChildArrMask = [currentItemForUpdate];

        while (!currentItemForUpdate._id.equals(category.categoryId)) {
          for (let i = 0; i < currentItemForUpdate.children.length; i++) {
            if (currentItemForUpdate.children[i].childIds[category.categoryId]) {
              elementsToCreateChildArrMask.push(currentItemForUpdate.children[i]);
              currentItemForUpdate = currentItemForUpdate.children[i];
              break;
            }
          }
          if (currentItemForUpdate.children.length === 0) {
            break;
          }
        }

        currentItemForUpdate.children.push(toUpdateObj);

        for (let i = 0; i < elementsToCreateChildArrMask.length; i++) {
          const obj = elementsToCreateChildArrMask[i].childIds;
          _.assignIn(obj, idsOfArr);
        }

        await CategoryRead.update(itemForUpdate, itemForUpdate._id);
      } else {
        await CategoryRead.update(itemForFind, itemForFind._id);
        await CategoryRead.create(toUpdateObj);
      }
    } else {
      await CategoryRead.update(itemForFind, itemForFind._id);
    }
  }

  async buildBreadcrums(category) {
    const itemBreadcrums = _.pick(category, [
      'isDeleted',
      '_id',
      'title',
      'categoryId',
      'createdAt',
      'updatedAt',
      '__v',
    ]);
    const newData = {
      _id: category._id,
      breadCrums: [itemBreadcrums],
      recipeId: [],
      articleId: [],
      updatedAt: category.updatedAt,
      createdAt: category.createdAt,
    };

    if (!category.categoryId) {
      await BreadcrumsRead.create(newData);
    } else {
      const item = await BreadcrumsRead.findById(category.categoryId);

      const data = {
        _id: category._id,
        breadCrums: [itemBreadcrums].concat(item.breadCrums),
        recipeId: [],
        articleId: [],
        updatedAt: category.updatedAt,
        createdAt: category.createdAt,
      };
      await BreadcrumsRead.create(data);
    }
  }

  async breadCrumsRebuild({ category, _id, isDelete }) {
    let newBreadcrums = {};
    let objWithBreadcrums;

    if (category.categoryId) {
      objWithBreadcrums = await BreadcrumsRead.findById(category.categoryId);
      if (!isDelete) {
        const data = {
          breadCrums: [category].concat(objWithBreadcrums.breadCrums),
          updatedAt: category.updatedAt,
          recipeId: objWithBreadcrums.recipeId,
          articleId: objWithBreadcrums.articleId,
        };
        newBreadcrums = await BreadcrumsRead.update(data, _id);
      } else {
        await BreadcrumsRead.delete(_id);
      }

    } else {
      objWithBreadcrums = await BreadcrumsRead.findById(_id);
      if (!isDelete) {
        const newData = {
          _id,
          breadCrums: [category],
          recipeId: objWithBreadcrums.recipeId,
          articleId: objWithBreadcrums.articleId,
        };

        newBreadcrums = await BreadcrumsRead.update(newData, _id);
      } else {
        await BreadcrumsRead.delete(_id);
      }
    }

    if (isDelete) {
      newBreadcrums.breadCrums = objWithBreadcrums.breadCrums;
    } else {
      newBreadcrums.breadCrums[0].updatedAt = category.updatedAt;
    }

    const elementsToUpdate = await BreadcrumsRead.findManyByField(_id);

    const arrayOfPromise = elementsToUpdate.map((element) => {
      const oldBreadcrums = [];
      for (let i = 0; i < element.breadCrums.length; i++) {
        if (element.breadCrums[i].categoryId.equals(_id) && isDelete) {
          element.breadCrums[i].updatedAt = category.updatedAt;
          element.breadCrums[i].categoryId = category.categoryId;
        }
        if (element.breadCrums[i]._id.equals(_id)) {
          break;
        }
        oldBreadcrums.push(element.breadCrums[i]);
      }
      const newData = {
        breadCrums: oldBreadcrums.concat(newBreadcrums.breadCrums),
        updatedAt: category.updatedAt,
      };
      return BreadcrumsRead.update(newData, element._id);
    });
    await Promise.all(arrayOfPromise);
  }

  async breadcrumsArticleRecipeUpdate({ data, type, isDelete }) {
    const breadCrums = await BreadcrumsRead.findById(data.categoryId);
    let newData;
    if (type === 'recipe') {
      const { recipeId } = breadCrums;
      if (isDelete) {
        const index = _.findIndex(recipeId, function(o) { return o._id.equals(data._id)});
        recipeId.splice(index, 1);
      } else {

        recipeId.push(data._id);
      }
      newData = {
        recipeId,
      };

    } else if (type === 'article') {
      const { articleId } = breadCrums;
      if (isDelete) {
        const index = _.findIndex(articleId, function(o) { return o._id.equals(data._id)});
        articleId.splice(index, 1);
      } else {
        articleId.push(data._id);
      }
      newData = {
        articleId,
      };
    }
    await BreadcrumsRead.update(newData, data.categoryId);
  }

  getAll() {
    return CategoryRead.findAll();
  }

  getById(_id) {
    return CategoryWrite.findById(_id);
  }

  async create(data) {
    const category = await CategoryWrite.create(data);
    eventBus.emit('buildTree', category);
    eventBus.emit('buildBreadcrums', category);
    return category;
  }

  async delete(_id) {
    const category = await CategoryWrite.findById(_id);

    const log = await CategoryWrite.updateByParentId(
      _id,
      category.categoryId,
    );

    await RecipeWrite.deleteArray(_id);
    await ArticleWrite.deleteArray(_id);

    eventBus.emit('reBuildTree', { category, _id, isDelete: true });
    eventBus.emit('reBuildBreadcrums', { category, _id, isDelete: true });
    return CategoryWrite.delete({
      _id,
    });
  }

  async update({ data, _id }) {
    const category = await CategoryWrite.update(data, _id);
    eventBus.emit('reBuildTree', { category, _id, isDelete: false });
    eventBus.emit('reBuildBreadcrums', { category, _id, isDelete: false });
    return category;
  }

  async getCategoryList(categoryId) {
    let item = await BreadcrumsRead.findByCategoryId(categoryId);
    if (item) {
      item = item.breadCrums;
    }
    return item;
  }

  categoryFullInfo(id) {
    return CategoryWrite.categoryFullInfo(id);
  }
}

export default new CategoryAction();
