import eventBus from '../component/eventBus';
import categoryAction from '../action/category';

eventBus.onSeries('buildTree', async (data, next) => {
  try {
    await categoryAction.tree(data);
  } catch (e) {
  }
  await next();
});

eventBus.onSeries('reBuildTree', async (data, next) => {
  try {
    await categoryAction.treeRebuild(data);
  } catch (e) {
  }
  await next();
});