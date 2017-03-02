import {dbList} from './../../db';
import config from '../../config';
import keygen from 'keygen';
export let secretKeyWrite = dbList.write('secretKey');

secretKeyWrite.getLast = function * () {
  return yield secretKeyWrite.aggregateRows({
    query: [
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $limit: config.secretKey.keepCount
      }
      ]
  });
}

secretKeyWrite.generateNew = function * () {
  return yield secretKeyWrite.insertRow({
    data:{
      key: keygen.url(config.secretKey.length)
    }
  });
}

secretKeyWrite.deleteOld = function * (oldKey) {
  yield secretKeyWrite.deleteRows({
      query: {
        _id: {
          $nin: oldKey
        }
      }
    });
}