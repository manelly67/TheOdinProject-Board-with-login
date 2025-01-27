const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const db = require('../db/queries');
const mainController = require('../controllers/mainController');
const messageController = require('../controllers/messagesControllers');
const { isAuth, isAdmin, clearMessages, loginRequired } = require('./authMiddelware');

router.get('/', mainController.getHomePage);

router.get('/sign-up',mainController.signUpGet);
router.post('/sign-up',mainController.signUpPost);

router.get('/join_the_club',mainController.joinGet);
router.post('/join_the_club',mainController.joinPost);
router.get('/welcome',mainController.welcomePage);

router.get('/members-board', isAuth, messageController.membersBoardGet);
router.get('/admin-board', isAuth, isAdmin, messageController.adminBoardGet);

router.get('/new_message', loginRequired, messageController.newMessageGet);
router.post('/new_message', loginRequired, messageController.newMessagePost);

router.post('/delete_message/:id',isAdmin, messageController.messageDeletePost);


// routes to authenticate 
router.get('/log-in', mainController.loginGet);
router.get('/required_login', messageController.askForLogin);

// the following routes require password.js
router.post(
    '/log-in',  clearMessages,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/log-in',
      failureMessage: true,
    })
  ); 
  
  router.post(
    '/log-in-for-join', clearMessages,
    passport.authenticate('local', {
      successRedirect: '/join_the_club',
      failureRedirect: '/join_the_club',
      failureMessage: true,
    })
  );

  router.post(
    '/required_login', clearMessages,
    passport.authenticate('local', {
      successRedirect: '/new_message',
      failureRedirect: '/required_login',
      failureMessage: true,
    })
  );

    
  router.get('/log-out', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
  
  router.get('/log-out-to-sign-up', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/sign-up');
    });
  });
  
  
  // Las tres funciones requeridas para el funcionamiento de passport.js
  
  passport.use(
    new LocalStrategy( async (username, password, done) => {
      //passport need this names (username and password) in the login form
      
      try {
        const user = await db.getUserData(username);
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
          
        }
        const match = await bcrypt.compare(password, user.user_password);
        if (!match) {
          // passwords do not match!
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.getUserFromId(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  


module.exports = router;