import mongoose from 'mongoose';
import * as _ from 'lodash';
import standardField from '../../component/db/dbStandardField';

export let userWriteSchema = new mongoose.Schema(
  _.assignIn(
    _.cloneDeep(standardField),
    {
      login: { type: String, required: true, trim: true, unique : true },
      email: { type: String, required: true, trim: true, unique : true },

      isOnline : { type : Boolean, default : false },
      lastLoginTime : { type: Date, default: Date.now },

      salt : String,
      password : String,

      // identities : {
      //   twitterId : { type : String, default : '' },
      //   facebookId : { type : String, default : '' },
      //   vkontakteId : { type : String, default : '' },
      //   googleId : { type : String, default : '' }
      // }
    }));