module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('hashtag', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, {
            foreignKey: 'hashtagId',
            as: 'Posts',
            through: 'PostHashtag',
        });  
    }


    return Hashtag;
}