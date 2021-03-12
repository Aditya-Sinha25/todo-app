const User = require("../models/user");
const List =require('../models/list');

module.exports.profile =function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:'User Profile',
            user:user
        })
    })
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
    return res.render('user_sign_in',{
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
                }return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}


module.exports.createSession =function(req,res){
    //console.log(req.session.passport.user);
    return res.redirect(`/users/${req.session.passport.user}`);
}

module.exports.destroySession =function(req,res){
    console.log('destroy session:');
    console.log(req);
    req.logout();
    return res.redirect('/');
   //return res.render('home',{
   //    title:'home'
   //});
}

module.exports.createList =async function(req,res){
    let list=await List.create({
        description:req.body.description,
        category:req.body.category,
        date:req.body.date
    });
    //console.log(list);
    let user=await User.findById(req.params.id);
    if(user){
        user.list.push(list);
        user.save();
        return res.redirect('back');
    }
    else{
        console.log('There was some error');
        return res.redirect('/');
    }
}

//module.exports.homeUser = async function(req,res){
//    //console.log(req.params.id);
//
//   //let user =await User.findById({_id:req.params.id},function(err,foundUser){
//   //    if(err){
//   //        console.log('Error in finding the user');
//   //        console.log(err);
//   //    }
//   //    foundUser.populate('list').
//   //    exec(function(err,doc){
//   //        if(err){
//   //            console.log('error comming from user home');
//   //            console.log('err');
//   //        }
//   //        return res.render('user_home',{
//   //            title:'User Home',
//   //            user:doc
//   //        })
//   //    })
//   //})
//
//    let user=await User.findById(req.params.id).
//        populate('list').
//        exec(function(err,doc){
//            if(err){
//                console.log('error occuring form there');
//                console.log(err);
//            }
//            return res.render('user_home',{
//                title:'User Home',
//                user:doc
//            })
//        })
//
//
//}

module.exports.homeUser =async function(req,res){
    try{
        let user =await User.findById(req.params.id)
        .populate('list').
        exec(function(err,doc){
            if(err){
                console.log('Error coming from homeUser',err);
            }
            return res.render('user_home',{
                title:'User Home',
                user:doc
            })
        })
    }catch(err){
        console.log('Error: ',err);
        return;
    }
}