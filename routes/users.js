const express =require('express');
const router =express.Router();
const passport =require('passport');
const userController =require('../controllers/users_controller');

//router.get('/sign-up',userController.signUp);
//router.get('/sign-in',userController.signIn);
//router.get('/sign-out',userController.destroySession);
router.get('/:id',passport.checkAuthentication,userController.homeUser);
router.get('/profile/:id',passport.checkAuthentication,userController.profile);

router.post('/list/:id',passport.checkAuthentication,userController.createList);


//router.post('/create',userController.create);
//router.post('/create-session',passport.authenticate(
//    'local',
//    {failureRedirect:'/users/sign-in'},
//),userController.createSession);

router.get('/destroy/:id',passport.checkAuthentication,userController.destroyList);


module.exports =router;