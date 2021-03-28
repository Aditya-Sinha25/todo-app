module.exports.home =function(req,res){
    return res.render('home',{
        title:'home'
    });
}


module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/:id')
    }

    return res.render('user_sign_up',{
        title:'todo'
    })
}

module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/:id')
    }
    //console.log("Error after here");
    return res.render('home',{
        title:'todo'
    })
}

module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    //find the user and check if it alredy exists
    //create the route as well
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("Error in signing up the form");
            return
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log("Error in finding the user");
                    return
                }return res.redirect('/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}


module.exports.createSession =function(req,res){
    //console.log(req);
    req.flash('success','Logged in successfully');
    return res.redirect(`/users/${req.session.passport.user}`);
}

module.exports.destroySession =function(req,res){
    console.log('destroy session:');
    req.logout();
    req.flash('success','You have logged out');
    return res.redirect('/');
}
