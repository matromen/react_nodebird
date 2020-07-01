const express = require('express');
const router = express.Router();
const {Sequelize, sequelize, Post, User, Image} = require('../models');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/', async (req, res, next)=>{
    try{
        let where = {};  // 인피니티 스크롤로 인해 최초 lastId=0 그 이후 기존 마지막 불러운 id 보다 작은 id 값을 호출 10개씩
        if(parseInt(req.query.lastId)){
            where = {
                id: {[Sequelize.Op.lt] : parseInt(req.query.lastId)}
            }
        }

        const posts = await Post.findAll({
            where,
            include: [{
                model: User, attributes: ['id', 'userId', 'nickName']
            },{
                model: Image
            },{
                model: User, as: 'Likers', attributes: ['id', 'nickName']
            },{
                model: Post, as: 'Retweets', include: [
                    {model: User, attributes: ['id', 'nickName']},
                    {model: Image}
                ]
            }],
            order: [['createdAt', 'desc'], ['updatedAt', 'desc']],
            limit: parseInt(req.query.limit)
        });
        res.json(posts);
    }catch(error){
        next(error);
    }
})


module.exports = router;