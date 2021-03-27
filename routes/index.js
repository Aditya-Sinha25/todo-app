const express =require('express');
const router =express.Router();
const passport =require('passport');
const homeController =require('../controllers/home_controller');

router.get('/',homeController.home);
router.use('/users',require('./users'));


router.get('/sign-up',homeController.signUp);
router.get('/sign-in',homeController.signIn);
router.get('/sign-out',homeController.destroySession);

router.post('/create',homeController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/sign-in'},
),homeController.createSession);

module.exports =router;