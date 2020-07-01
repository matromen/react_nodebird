const local = require('./localStrategy');
const {sequelize, User, Post} = require('../models');

module.exports = (passport) => {
    passport.serializeUser( (user, done) => { //req.login() 실행시, req.session.user or req.session.passport.user 값이 정해짐. <=  {passport: {"user":1}} passport 값은 이게 다임.
        return done(null, user.id);
    });

    passport.deserializeUser( async (id, done) => {
        try{
            const user = await User.findOne({
                attributes: ['id', 'nickName', 'userId'],
                where: {
                    id
                },
                include: [
                    {
                        model: Post, attributes: ['id']
                    },
                    {
                        model: User, attributes: ['id'], as: 'Followers'
                    },
                    {
                        model: User, attributes: ['id'], as: 'Followings'
                    }
                ]
            });

            return done(null, user); //req.user 생성 done(null, user)로 인해 <= req.user 정보는 아래에 남겼음

        }catch(error){
            console.log(error);
            done(error);
        }
    });

    local(passport);
}



// user {
//     dataValues:
//      { id: 1,
//        email: 'matromen@naver.com',
//        password:
//         '$2b$12$ztpgIOZjoddp5Mi.s1ZXE.ucEe1Mbkm42aCFKkLr6XYz9tTTFGwIi',
//        nick: 'nickì
//                    ',
//        createdAt: 2020-03-24T20:23:47.000Z,
//        updatedAt: 2020-03-24T20:23:47.000Z,
//        deletedAt: null },
//     _previousDataValues:
//      { id: 1,
//        email: 'matromen@naver.com',
//        password:
//         '$2b$12$ztpgIOZjoddp5Mi.s1ZXE.ucEe1Mbkm42aCFKkLr6XYz9tTTFGwIi',
//        nick: 'nickì
//                    ',
//        createdAt: 2020-03-24T20:23:47.000Z,
//        updatedAt: 2020-03-24T20:23:47.000Z,
//        deletedAt: null },
//     _changed: {},
//     _modelOptions:
//      { timestamps: true,
//        validate: {},
//        freezeTableName: false,
//        underscored: false,
//        paranoid: true,
//        rejectOnEmpty: false,
//        whereCollection: { id: 1 },
//        schema: null,
//        schemaDelimiter: '',
//        defaultScope: {},
//        scopes: {},
//        indexes: [],
//        name: { plural: 'users', singular: 'user' },
//        omitNull: false,
//        timestamp: true,
//        charset: 'utf8',
//        collate: 'utf8_general_ci',
//        sequelize:
//         Sequelize {
//           options: [Object],
//           config: [Object],
//           dialect: [MysqlDialect],
//           queryInterface: [QueryInterface],
//           models: [Object],
//           modelManager: [ModelManager],
//           connectionManager: [ConnectionManager],
//           importCache: {} },
//        hooks: {} },
//     _options:
//      { isNewRecord: false,
//        _schema: null,
//        _schemaDelimiter: '',
//        raw: true,
//        attributes:
//         [ 'id',
//           'email',
//           'password',
//           'nick',
//           'createdAt',
//           'updatedAt',
//           'deletedAt' ] },
//     isNewRecord: false }