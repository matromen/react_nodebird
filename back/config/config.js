require('dotenv').config();

module.exports = 
{
    development: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "react_nodebird",
        host: "127.0.0.1",
        dialect: "mysql",
        // charset: 'utf8mb4',
        // collate: 'utf8mb4_general_ci',          
        operatorsAliases: false
    },
    test: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "react_nodebird",
        host: "127.0.0.1",
        dialect: "mysql",
        operatorsAliases: false
    },
    production: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "react_nodebird",
        host: "127.0.0.1",
        dialect: "mysql",
        operatorsAliases: false,  
        logging: false
    }
  }
  