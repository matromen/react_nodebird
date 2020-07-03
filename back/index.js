const express = require('express');
const path = require('path');
const {sequelize} = require('./models');
const morgan = require('morgan');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport')

require('dotenv').config();

const prod = process.env.NODE_ENV === 'production';


const app = express();
sequelize.sync();
passportConfig(passport);


if(prod){
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(cors({
        origin: 'http://15.165.190.8',
        credentials: true                       //프론트 서버와 쿠키 공유를 위해
    }));

}else{
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true                       //프론트 서버와 쿠키 공유를 위해
    }));
}


const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');


app.get('/', (req, res)=>{
    res.send('정상 가동중');
});
app.use('/', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));   
app.use(expressSession({
    resave: false,                   //매번 세션 강제 저장
    saveUninitialized: false,        //빈 값도 저장
    secret : process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'pcheck'
}));
app.use(passport.initialize());  //req.session객체에 passport를 저장
app.use(passport.session());


app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);


app.listen(prod ? process.env.PORT : 3100, ()=>{
    console.log(`server is running on port ${prod ? process.env.PORT : 3100}`);
});

