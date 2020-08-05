const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = function(passport){
    passport.serializeUser((user, done) => done(null, { id: user.id, _socket: user._socket }));

    passport.deserializeUser((user, done) => {
        
    });

};