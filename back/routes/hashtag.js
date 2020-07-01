const express = require('express');
const {Sequelize, User, Hashtag, Post, Image} = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next)=>{
    // console.log('tag : ', `${tag}`);
    try{
        let where = {};
        if(parseInt(req.query.lastId)){
            where = {
                id: {
                    [sequelize.Op.lt]: parseInt(req.query.lastId)
                }
            }
        }
        const posts = await Post.findAll({
            where,
            include: [
                {model: Hashtag, attributes: ['id', 'name'], as: 'Hashtags', where: {
                    name: decodeURIComponent(req.params.tag)
                }},
                {
                    model: User, attributes: ['id', 'nickName']
                },
                {
                    model: User, as: 'Likers', attributes: ['id', 'nickName']
                },
                {
                    model: Post, as: 'Retweets', include: [
                        {model: User, attributes: ['id', 'nickName']},
                        {model: Image}
                    ]
                }
            ],
            limit: parseInt(req.query.limit)
        })

        res.json(posts);
        // res.send(req.params.tag);
    }catch(error){
        console.error(error);
        next(error);
    }

});


module.exports = router;