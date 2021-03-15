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
        req.flash('success','Task added successfully');
        return res.redirect('back');
    }
    else{
        console.log('There was some error');
        req.flash('error','Error in adding the task');
        return res.redirect('/');
    }
}


module.exports.homeUser =async function(req,res){

    try{
        let user =await User.findById(req.params.id)
        .populate('list');
        return res.render('user_home',{
            title:'User Profile',
            user:user
        });

    }catch(err){
        console.log('Error: ',err);
        return;
    }
}

module.exports.destroyList =function(req,res){
    List.findById(req.params.id,function(err,list){
        if(err){
            console.log('Destroy list error: ',err);
            req.flash('error','Error in deleting the task');
            return res.redirect('back');
        }
        list.remove();
        req.flash('success','Task deleted successfully');
        User.findByIdAndUpdate(req.user.id,{$pull:{list:req.params.id}},
            function(err,user){
                return res.redirect('back');
            })
    });
}