module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },{
        // charset: 'utf8mb4',
        // collate: 'utf8mb4_general_ci'
        charset: 'utf8',
        collate: 'utf8_general_ci',
        freezeTableName: true,
        tableName: 'post',
    });

    Post.associate = (db) => {
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.User);
        db.Post.belongsTo(db.Post, {
            as: 'Retweets',                       //desc posts =>  fk : RetweetsId | int(11)  | YES  | MUL | NULL
        });
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.Hashtag, {
            foreignKey: 'postId',
            as: 'Hashtags',
            through: 'PostHashtag',
        });        
        db.Post.belongsToMany(db.User, {
            foreignKey: 'postId',
            as: 'Likers',
            through: 'Likee'
        });
        
    }


    return Post;
}