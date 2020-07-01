'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const env = process.env.NODE_ENV || 'development';
console.log('!!!!!!!!!!!!', env)
const config = require(path.join(__dirname, '..', 'config', 'config'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;


/////////////////////////////
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Image = require('./image')(sequelize,Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
/////////////////////////////


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;