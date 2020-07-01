const express = require('express');
const router = express.Router();
const {sequelize, User, Post, Image, Sequelize} = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../middlewares/auth'); 


router.get('/', isLoggedIn, (req, res)=>{
    if(!req.user){
        return res.status(403).json({code: 403, message: '로그인이 필요 합니다.'});
    }
    return res.json(req.user);
});

router.post('/', isNotLoggedIn, async (req, res, next)=>{
    const t = await sequelize.transaction();

    try{
        const exitUser = await User.findOne({
            where: { userId: req.body.userId }
        });
        if(exitUser){
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            userId: req.body.userId,
            password: hashedPassword,
            nickName: req.body.nickName,
        }, {transaction: t});

        await t.commit();
        console.log('newUser ', newUser)
        return res.json(newUser);
    }catch(e){
        await t.rollback(); 

        console.log(e);
        // return res.status(403).send(e); //이걸 하는게 맞는듯
        return next(e);  //프론트에 에러가 났음을 알려 줌.
    }
});


router.post('/login', async (req, res, next)=>{
    passport.authenticate('local', (authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            console.log(info);
            return res.status(403).json({code: 403, message: info.reason});
        }

        req.login(user, async (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }

            const fullUser = await User.findOne({     //{id: 1, nickName: "test", userId: "test", posts: [], Followers: [], Followings: []}
                attributes: ['id', 'nickName', 'userId'],
                where: {
                    id: user.id
                },
                include: [
                    {model: Post},
                    {model: User, attributes: ['id'], as: 'Followers' },
                    {model: User, attributes: ['id'], as: 'Followings'}
                ]
            });
            // const filterUser = Object.assign({}, fullUser.toJSON());
            // delete filterUser.password;

            return res.json(fullUser);
        });

    })(req, res, next);
})

router.get('/:id', async (req, res, next)=>{
    try{
        const tempUserInfo = await User.findOne({
            attributes: ['id', 'nickName'],
            where : {
                id: parseInt(req.params.id) || (req.user && req.user.id)
            },
            include: [
                {model: Post, attributes: ['id']},
                {model: User, attributes: ['id'], as: 'Followers'},
                {model: User, attributes: ['id'], as: 'Followings'}
            ]
        });

        const userInfo = tempUserInfo.toJSON();
        userInfo.posts = userInfo.posts ? userInfo.posts.length : 0;
        userInfo.Followers = userInfo.Followers ? userInfo.Followers.length: 0;
        userInfo.Followings = userInfo.Followings ? userInfo.Followings.length: 0;
        
        res.json(userInfo);
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.post('/logout', (req, res)=>{
    req.logOut();
    req.session.destroy();
    console.log('req.user', req.user);
    res.send('logout 성공');

})

router.post('/:id/follow', isLoggedIn,  async (req, res, next)=>{
    try{
        const me = await User.findOne({where: {id: req.user.id}});
        await me.addFollowing(req.params.id);

        res.send(req.params.id)
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.delete('/:id/follow', isLoggedIn, async (req, res, next)=>{ //내가 팔로윙 한거 지우기
    try{
        const me = await User.findOne({where: {id: req.user.id}});
        await me.removeFollowing(req.params.id);

        res.send(req.params.id);
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/:id/followings', isLoggedIn, async (req,res,next)=>{
    try{
       const userModel = await User.findOne({where: {id: parseInt(req.params.id) || (req.user && req.user.id) || 0}});
       const followings = await userModel.getFollowings({
           attributes: ['id', 'nickName'],
           limit: parseInt(req.query.limit),
           offset: parseInt(req.query.offset),
       });

       res.json(followings);
    }catch(error){
        console.error(error);
        next(error);
    }
})
// getFollowers
/*
   [ { id: 2, nickName: 'test2', Follow: [Object] },
     { id: 3, nickName: 'test', Follow: [Object] },
     { id: 4, nickName: 'test', Follow: [Object] } ] 
*/
router.get('/:id/followers', isLoggedIn, async (req,res,next)=>{
    try{
        const userModel = await User.findOne({where: {id: parseInt(req.params.id) || (req.user && req.user.id) || 0}});
        const followers = await userModel.getFollowers({
            attributes: ['id', 'nickName'],
            limit: parseInt(req.query.limit),
            offset: parseInt(req.query.offset),
        });
        res.json(followers);
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.delete('/:id/follower', isLoggedIn, async (req, res, next)=>{ //나를 팔로워 한거 지우기
    try{
        const userModel = await User.findOne({where: {id: req.user.id}});
        await userModel.removeFollower(req.params.id);

        res.send(req.params.id);
    }catch(error){
        console.error(error);
        next(error);
    }
})




router.get('/:id/posts', isLoggedIn, async (req, res, next) => {
    try{
        
        const posts = await Post.findAll({
            where: {
                userId: parseInt(req.params.id, 10) || req.user.id,
                RetweetsId: null,
                id: parseInt(req.query.lastId) ? {[Sequelize.Op.lt]: parseInt(req.query.lastId)} : {[Sequelize.Op.not]: null}, 
            },
            include: [
                {model: User, attributes: ['id', 'nickName']},
                {model: Image}
            ],
            order: [['createdAt', 'desc'], ['updatedAt', 'desc']],
            limit: parseInt(req.query.limit)
        })

        res.json(posts);

    }catch(error){
        console.error(error);
        next(error);
    }
})

router.patch('/nickname', isLoggedIn, async (req, res, next)=>{
    const t = await sequelize.transaction();

    try{
        await User.update({
            nickName: req.body.nickName
        }, {
            where: {id: req.user.id},
            transaction: t
        });
        await t.commit();

        res.send(req.body.nickName);
        
    }catch(error){
        await t.rollback();

        console.error(error);
        next(error);
    }
})

module.exports = router;