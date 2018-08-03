'use strict';

import nconf from 'nconf';
import * as _ from 'lodash';
import staticConfig from './static/config.js';

nconf.env().argv();

const environment = nconf.get('NODE_ENV') || 'development';

export default _.extend({
    http: {
      port: process.env.PORT || 8000
    },
    environment,
  },
  staticConfig,
  require(`${__dirname}/env/${environment}`),
  nconf.get());
