'use strict';

const COS = require('cos-nodejs-sdk-v5');

const trimParam = str => typeof str === "string" ? str.trim() : undefined

module.exports = {
  provider: 'tencent-cloud-cos',
  name: 'Tencent Cloud Object Storage Service',
  auth: {
    public: {
      label: 'Access API Token',
      type: 'text'
    },
    private: {
      label: 'Secret Access Token',
      type: 'text'
    },
    region: {
      label: 'Region',
      type: 'enum',
      values: [
        'ap-beijing',
        'ap-shanghai',
        'ap-guangzhou',
        'ap-chengdu',
        'ap-chongqing',
        'ap-shenzhen-fsi',
        'ap-shanghai-fsi',
        'ap-beijing-fsi',
        'ap-hongkong',
        'ap-singapore',
        'ap-mumbai',
        'ap-seoul',
        'ap-bangkok',
        'ap-tokyo',
        'na-siliconvalley',
        'na-ashburn',
        'na-toronto',
        'eu-frankfurt',
        'eu-moscow'
      ]
    },
    bucket: {
      label: 'Bucket',
      type: 'text'
    }
  },
  init: (config) => {
    
    const cos = new COS({
      SecretId: trimParam(config.public),
      SecretKey: trimParam(config.private),
      Domain: `${trimParam(config.bucket)}.cos.${trimParam(config.region)}.myqcloud.com`,
    });

    return {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          const path = file.path ? `${file.path}/` : '';
          cos.putObject({
            Key: `${path}${file.hash}${file.ext}`,
            Body: new Buffer(file.buffer, 'binary'),
          }, function (err, data) {
            if (err) {
              return reject(err);
            }
            file.url = data.Location;
            resolve();
          });
        });
      },
      delete: (file) => {
        return new Promise((resolve, reject) => {
          const path = file.path ? `${file.path}/` : '';
          cos.deleteObject({
            Key: `${path}${file.hash}${file.ext}`,
          }, function (err, data) {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      }
    };
  }
};

