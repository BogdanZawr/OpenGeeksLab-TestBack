import mongoose from 'mongoose';
import * as _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export let asymmetricEncryptionWriteSchema = new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      private: { type: Object, required: true },
      public: { type: Object }
    }));