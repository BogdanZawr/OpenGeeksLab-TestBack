import keygen from 'keygen';
import db from '../../component/db';
import config from '../../config';

const tokenWrite = db.model('write', 'token');

class TokenWrite {
  genNew(user) {
    return tokenWrite.insertRow({
      data: {
        token: keygen.url(config.token.refreshLength),
        userId: user._id,
        expire: new Date(new Date().getTime() + config.token.refreshExpired),
      },
    });
  }

  async getUserToken(userId) {
    return (await tokenWrite.findRow({
      query: {
        userId,
      },
    })).token;
  }

  getNonExpiredToken(token) {
    return tokenWrite.findRow({
      query: {
        token,
        expire: {
          $gt: new Date(),
        },
      },
    });
  }

  deleteExpired() {
    return tokenWrite.deleteRows({
      query: {
        expire: {
          $lt: new Date(),
        },
      },
    });
  }
}

export default new TokenWrite();
