const express = require('express');
const path = require('path');
const {sequelize} = require('./models');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport')

require('dotenv').config();

const prod = process.env.NODE_ENV === 'production';


const app = express();
sequelize.sync();
passportConfig(passport);



const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

app.use(morgan('dev'));


app.use('/', express.static('uploads'));
app.use(cors({
    // origin: 'http://localhost:3060',
    origin: 'http://3.12.214.128',
    // origin: true,
    credentials: true                       //프론트 서버와 쿠키 공유를 위해
}));
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

