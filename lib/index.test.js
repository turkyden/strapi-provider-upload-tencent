'use strict';

const SPUT = require('./index');

const config = {
  public: '',
  private: '',
  region: 'ap-beijing',
  bucket: '',
}

const sput = SPUT.init(config);

const file = '';
sput.upload(file).then(() => {});

sput.delete(file).then(() => {});
