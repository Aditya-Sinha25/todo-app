const passport =require('passport');
const LocalStrategy =require('passport-local').Strategy;
const User =require('../models/user');

passport.use(new LocalStrategy({
        usernameField:'email',
    },
    function(email,password,done){
        //find a user and establish the identity
        //console.log('Done: ',done);
        User.findOne({email:email}, function(err,user){
            if(err){
                console.log('Error in findig the user');
                return done(err);
            }

            if(!user || user.password!=password){
                console.log('Invalid username/password');
                return done(null,false);
            }

            return done(null,user);
        });
    }
));


//serializing the user to decide which key to be kept in the cokkie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserialize the user
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in findig the user');
            return done(err);
        }

        return done(null,user);
    });
});

//check if the user is authenticated
passport.checkAuthentication =function(req,res,next){
    //if the user is signed in,pass on the request in the next function controller's action
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser =function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session's cookie
        //and we are just sending this to locals for the view
        res.locals.user =req.user;
        //res.cookie('user_id',res.locals.user._id);
        //console.log(req.cookie);
        //console.log(res.locals.user);
    }
    next();
}

module.exports =passport;