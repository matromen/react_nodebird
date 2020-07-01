const express = require('express');

exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        return res.status(401).send('로그인이 필요합니다.');
    }else{
        return next();
    }
}


exports.isNotLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return res.status(401).send('이미 로그인이 되어 있습니다.');
    }else{
        return next();
    }
}