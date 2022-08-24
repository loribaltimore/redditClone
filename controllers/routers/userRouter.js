let express = require('express');
let userRouter = express.Router({ mergeParams: true });
let { renderLogin, login, createUser, renderHome } = require('../userController');
let { locals } = require('../../middleware/locals');
let multer = require('multer');
let storage = require('../../config/cloudinaryConfig');
let upload = multer({ storage: storage });
let passport = require('passport');
let localStrategy = require('passport-local');
userRouter.use(locals);

userRouter.route('/')
    .get(renderLogin)
    .post(passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), login);

userRouter.route('/signup')
    .post(upload.array('img'), createUser);

userRouter.route('/home')
    .get(renderHome);


module.exports = userRouter;