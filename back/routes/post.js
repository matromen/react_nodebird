const express = require('express');
const router = express.Router();
const {sequelize, Post, Hashtag, User, Comment, Image} = require('../models/');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const {isLoggedIn} = require('../middlewares/auth');

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});


const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'matromen-react-nodebird',
        key(req, file, cb){
            cb(null, `original/${+new Date()}${path.basename(file.originalname)}`)
        }
    }),
    limits: {fileSize: 20*1024*1024}
});




// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, cb){
//             cb(null, 'uploads');
//         },
//         filename(req, file, cb){
//             const ext = path.extname(file.originalname);
//             cb(null, path.basename(file.originalname, ext)+'_'+Date.now()+ext)
//         }
//     }),
//     limits: {fileSize: 20*1024*1024}
// });



// upload.single('images') : req.file 그외는  req.files
    
// { fieldname: 'images',
//   originalname: '1c554b76d1ca4a08bd3e6750aecd3337.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads',
//   filename: '1c554b76d1ca4a08bd3e6750aecd3337_1593728582799.jpg',
//   path:
//    'uploads\\1c554b76d1ca4a08bd3e6750aecd3337_1593728582799.jpg',
//   size: 65925 }


router.post('/images/', upload.array('images'), (req, res, next)=>{
    console.log(req.files.map(file => console.log(file)));
    // res.json(req.files.map(file=>file.filename));
    res.json(req.files.map(file=>file.location));
})

router.post('/', upload.none(), async (req, res, next)=>{
    const t = await sequelize.transaction();

    try{
        //Post create
        let newPost = await Post.create({
            content: req.body.content,
            userId: req.user.id
        }, {transaction: t});
        
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if(hashtags){
            //Hashtag create
            const result = await Promise.all(hashtags.map(tag=> Hashtag.findOrCreate({
                where: {name: tag.slice(1).toLowerCase()},
                transaction: t
            })));
            //두 table의 관계 table인 PostHashtag create
            await newPost.addHashtags(result.map(r=>r[0].id), {transaction: t});
        }

        if(Array.isArray(req.body.images)){
            const result2 = await Promise.all(req.body.images.map(image=>{
                return Image.create({
                    src: image,
                    postId: newPost.id
                }, {transaction: t});
            }));
        }else{
            if(req.body.images){
                await Image.create({
                    src: req.body.images,
                    postId: newPost.id
                },{transaction: t});
            }
        }

        const newNewPost = await Post.findOne({
            where: {id: newPost.id},
            include: [{
                model: User, attributes: ['id', 'userId', 'nickName']
            },{
                model: Image
            },{
                model: User, as: 'Likers', attributes: ['id', 'nickName']
            }],
            transaction: t
        })
        // const user = await newPost.getUser();
        // console.log('user : ', user);

        // newPost.user = user.toJSON();
        // console.log(newPost.user);

        await t.commit();
        console.log(newNewPost);

        return res.json(newNewPost);
    }catch(error){
        await t.rollback(); 
        // return next(error);
        console.error(error);
        return res.status(401).json({code:401, message:'등록오류'});
    }
});




router.get('/:id/comments', async (req, res, next)=>{
    try{
        const post = await Post.findOne({where: {id: req.params.id}});
        if(!post){
            res.status(404).send('글이 없습니다.');
        }

        const comments = await Comment.findAll({
            where: {postId: req.params.id},
            order: [['createdAt', 'desc']],
            include: [{
                model: User, attributes: ['id', 'nickName']
            }]
        });

        return res.json(comments);
    }catch(error){  
        console.error(error);
        next(error);
    }
})
router.post('/:id/comment', async (req, res, next)=>{
    const t = await sequelize.transaction();

    try{
        if(!req.user){
            return res.status(401).send('로그인이 필요 합니다.');
        }

        const post = await Post.findOne({where: {id: req.params.id},
            transaction: t});
        if(!post){
            return res.status(404).send('글이 없습니다.');
        }

        const newComment = await Comment.create({content: req.body.content, userId: req.user.id, postId: post.id}, {transaction: t});
        // await post.addComments(newComment.id);

        const comment = await Comment.findOne({
            where: {
                id: newComment.id,
            },
            include: [{
                model: User, attributes: ['id', 'nickName']
            }],
            transaction: t
        });
        console.log('comment0 ', comment);
        await t.commit();
        console.log('comment ', comment);
        return res.json(comment);

    }catch(error){
        await t.rollback(); 
        console.error(error);
        next(error);
    }
});

router.post('/:id/like', isLoggedIn, async (req, res, next)=>{
    try{
        const post = await Post.findOne({where: {id: req.params.id}});
        if(!post){
            return res.status(404).send('page not found');
        }

        await post.addLiker(req.user.id);
        res.json({user_id: req.user.id});
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.delete('/:id/unlike', isLoggedIn, async (req, res, next)=>{
    try{
        const post = await Post.findOne({where: {id: req.params.id}});
        if(!post){
            return res.status(404).send('page not found');
        }

        await post.removeLiker(req.user.id);
        res.json({user_id: req.user.id});
    }catch(error){
        console.error(error);
        next(error);
    }
});


router.post('/:id/retweet', isLoggedIn, async(req, res, next)=>{
    try{
        const post = await Post.findOne({where: {id: req.params.id}, include: [{model: Post, as: 'Retweets'}]});

        if(!post) return res.status(404).send('page not found');

        if(req.user.id === post.userId || (post.Retweets && post.Retweets.userId === req.user.id)) return res.status(403).send('자신의 글은 리트잇 할 수 없습니다.');
        
        const retweetId = post.RetweetId || post.id; 
        
        const existRetweetUserPost = await Post.findOne({where: {RetweetsId: retweetId, userId: req.user.id}}); 
        if(existRetweetUserPost) return res.status(403).send('이미 리트윗 했습니다.');

        const retweet = await Post.create({
            content: 'retweet',
            userId: req.user.id,
            RetweetsId: retweetId
        })

        const retweetWithPrevPost = await Post.findOne({
            where: {id: retweet.id},
            include: [
                {model: User, attributes: ['id', 'nickName']},
                {model: Post, as: 'Retweets', include: [
                    {model: User, attributes: ['id', 'nickName']},
                    {model: Image,}
                ]}
            ]
        });
        console.log(retweetWithPrevPost)
        return res.json(retweetWithPrevPost);
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.delete('/:id', isLoggedIn, async (req, res, next)=>{
    try{
        const post = Post.findOne({where: {id: req.params.id}});
        if(!post) return res.status(404).send('포스트가 존재 하지 않습니다.');
        Post.destroy({where: {id: req.params.id, userId: req.user.id}});
        res.send(req.params.id);
    }catch(error){
        console.error(error);
        next(error);
    }   
})

router.get('/:id', async (req, res, next)=>{
    try{
        const post = await Post.findOne({
            where: {id: parseInt(req.params.id)},
            include: [
                {model: User, attributes: ['id', 'nickName']},
                {model: Image}
            ]   
        });
        res.json(post);
    }catch(error){
        console.error(error);
        next(error);
    }
})



module.exports = router;