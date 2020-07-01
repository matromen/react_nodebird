module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        nickName: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
 
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, {
            foreignKey: 'userId',
            as: 'Likings',
            through: 'Likee'
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        });        
        db.User.belongsToMany(db.User, {
            foreignKey: 'FollowingId',
            as: 'Followers',
            through: 'Follow'
        });          
    }


    return User;
}