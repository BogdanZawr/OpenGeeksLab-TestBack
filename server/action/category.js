import * as _ from 'lodash';
import eventBus from '../component/eventBus';
import CategoryWrite from '../model/write/category';
import CategoryRead from '../model/read/category';
import RecipeWrite from '../model/write/recipe';
import ArticleWrite from '../model/write/article';

class CategoryAction {
  async tree(category) {
    const data = _.assignIn(category, { children: [] });

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
          }
        }
      }

      currentItem.childIds[category._id] = true;
      currentItem.children.push(data);

      await CategoryRead.update(item, item._id);
    }
  }

  async treeRebuild({ category, _id }) {
    const item = await CategoryRead.findByField(_id);
    let currentItem = item;
    const elementsToUpdate = [currentItem];
    let deletedItemIndex = _.findIndex(currentItem.children, function(o) { return o._id == _id.toString()});

    while (deletedItemIndex === -1) {
      for (let i = 0; i < currentItem.children.length; i++) {
        if (currentItem.children[i].childIds[_id]) {
          elementsToUpdate.push(currentItem.children[i]);
          currentItem = currentItem.children[i];
          deletedItemIndex = _.findIndex(currentItem.children, function(o) { return o._id == _id.toString()});
        }
      }
    }
    const toUpdateObj = _.cloneDeep(currentItem.children[deletedItemIndex]);
    const idsOfArr = _.cloneDeep(currentItem.children[deletedItemIndex].childIds);
    currentItem.children.splice(deletedItemIndex, 1);
    console.log(item);
    

    const deleteArr = Object.keys(idsOfArr);
    for (let i = 0; i < elementsToUpdate.length; i++) {
      for (let j = 0; j < deleteArr.length; j++) {
        if (elementsToUpdate[i].childIds[deleteArr[i]]) {
          delete elementsToUpdate[i].childIds[deleteArr[i]];
        }
      }
    }


    // const treeToUpdate = await CategoryRead.findByField(category.categoryId);
    // let currentTree = treeToUpdate;
    // let ids = _.assignIn(currentTree.childIds, idsOfArr);

    // while (!currentTree._id.equals(category.categoryId)) {
    //   for (let i = 0; i < currentTree.children.length; i++) {
    //     currentTree.childIds[category._id] = true;
    //     if (currentTree.children[i].childIds[category.categoryId]) {
    //       _.assignIn(currentTree.children[i].childIds, idsOfArr);
    //       currentTree = currentTree.children[i];
    //     }
    //   }
    // }
    // currentTree.childIds[category._id] = true;

    // if (!category.isDeleted) {
    //   _.assignIn(currentTree.childIds, idsOfArr);
    //   currentTree.children.push(toUpdateObj);
    // }

    // console.log(item, treeToUpdate);
    
    // await CategoryRead.update(treeToUpdate, treeToUpdate._id);

    // if (!category.categoryId) {
    //   await CategoryRead.create(treeToUpdate);
    // }

    // const refreshableObj = await CategoryRead.findById(_id);
    // console.log('CATEGORYID', refreshableObj);
    
    // if (!refreshableObj) {
    //   console.log('delete WoKRK');
      
    //   await CategoryRead.delete(_id);
    // }

    // await CategoryRead.update(item, item._id);
  }

  getAll() {
    return CategoryRead.findAll();
  }

  async getById(_id) {
    return CategoryWrite.findById(_id);
  }

  async create(data) {
    const category = await CategoryWrite.create(data);
    eventBus.emit('buildTree', category);
    return category;
  }

  async delete(_id) {
    const category = await CategoryWrite.findById(_id);

    await CategoryWrite.updateByParentId(
      _id,
      category.categoryId,
    );

    await RecipeWrite.deleteArray(_id);
    await ArticleWrite.deleteArray(_id);

    return CategoryWrite.delete({
      _id,
    });
  }

  async update({ data, _id }) {
    const category = await CategoryWrite.update(data, _id);
    eventBus.emit('reBuildTree', { category, _id });
    return category;
  }

  async getCategoryList(categoryId) {
    const categoryArray = await CategoryWrite.findAll();
    let categoryesIds = {};

    for (let i = 0; i < categoryArray.length; i++) {
      categoryesIds[categoryArray[i]._id] = categoryArray[i];
    }
    let category = categoryesIds[categoryId];
    let breadCrums = [category];

    while (category.categoryId) {
      category = categoryesIds[category.categoryId];
      breadCrums.push(category);
    }

    return breadCrums;
  }
}

export default new CategoryAction();
