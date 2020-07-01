const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {sequelize, User} = require('../models');


module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'userId',
        userpasswordField: 'password'
    }, async (userId, password, done)=>{
        try{
            const user = await User.findOne({where: {userId}});
            if(!user){
                return done(null, false, {reason: '존재하지 않는 사용자 입니다.'});
            }

            const result = await bcrypt.compare(password, user.password);
            if(result){
                return done(null, user);
            }else{
                return done(null, false, {reason: '비밀번호가 틀렸습니다.'});
            }
        }catch(error){
            console.log(error);
            return done(error);
        }
    }))
}