/**
 * config/passportLocalAuthentication
 * passport local authentication technique
 * createdAt: 30/01/2018 12:10 AM
 * Author: Hardik Patel
 * */

/**
 * include requre method and objects
 * */
const LocalStrategy = require('passport-local').Strategy,
    {User} = require('./../model/modelUser'),
    bcrypt = require('bcrypt');

/**
 * exporting local strategy
 * */
module.exports = (passport) => {

    /**
     * serialize user
     * */
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    /**
     * deserialize user
     * */
    passport.deserializeUser((user, done) => {
        done(null, user)
    });

    /**
     * authenticate user
     * */
    passport.use('local', new LocalStrategy((username, password, done) => {
        User.findOne({"email": username}, (err, user) => {
            if (err) {
                // if any error occure
                return done(err, null);
            }
            if (!user) {
                // if user not found
                return done(false, null);
            }
            if(user){
                // check for valid user
                bcrypt.compare(password,user.password,(err,result)=>{
                    if(!result){
                        // if password not match
                        console.log('enter valid details');
                        return done(false,null);
                    }else{
                        // when password match
                        console.log("success from local")
                        return done(false, user);
                    }
                })
            }

        });
    }));
}