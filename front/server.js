const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const next = require('next');
const path = require('path');


const dev = process.env.NODE_ENV !== 'product';

const app = next( {dev} );
const handle = app.getRequestHandler();

app.prepare().then( ()=> {
    const server = express();
    server.use(morgan('dev'));
    server.use('/', express.static(path.join(__dirname, 'public')));
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));
    server.use(cookieParser(process.env.COOKIE_SECRET));
    server.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        }
    }));

    server.get('/hashtag/:tag', (req,res)=>{
        return app.render(req, res, '/hashtag', {tag: req.params.tag});
    });
    server.get('/user/:id', (req, res)=>{
        return app.render(req, res, '/user', {id: req.params.id});
    });

    server.get('/post/:id', (req, res)=>{
        return app.render(req, res, '/post', {id: req.params.id});
    });
    
    server.get('*', (req, res)=>{
        return handle(req, res);
    });

    server.listen(3060, ()=>{
        console.log('next+express running on port 3060');
    })
});