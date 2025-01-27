const db = require('../db/queries');
const { appObject } = require('../appTitles');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passwordValidation = require('./password_validation');

const myObject = {};
require('dotenv').config({ processEnv: myObject });
const passwordRequirements =
  'Password must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters';
const initialStatus = 3; // status 3 is normal user
// code to change the status
const adminPassword = process.env.ADMINPASSWORD || myObject.ADMINPASSWORD;
const membershipPassword =
  process.env.MEMBERSHIPPASSWORD || myObject.MEMBERSHIPPASSWORD;

async function getHomePage(req, res) {
  switch (req.isAuthenticated()) {
    case false: {
      const messages = await db.getAllMessages();
      res.render('index', {
        appObject: appObject,
        title: appObject.title[0],
        user: req.user,
        messages: messages,
      });
      break;
    }
    case true: // when user is login
      switch (res.locals.currentUser.id_membership_status === 1) {
        case true:
          res.redirect('/admin-board');
          break;
        default:
          switch (res.locals.currentUser.id_membership_status === 2) {
            case true:
              res.redirect('/members-board');
              break;
            default:
              switch (res.locals.currentUser.id_membership_status === 3) {
                case true:
                  res.redirect('/join_the_club');
                  break;
              }
          }
      }
  }
}

async function signUpGet(req, res) {
  res.render('sign-up-form', {
    appObject: appObject,
    title: appObject.title[5],
    user: req.user,
    passwordRequirements: passwordRequirements,
  });
}

// sign-up POST form validation
const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 30 characters.';
const emailErr = 'must be a valid email address';
const usernameErr = 'Excessive use of characters';
const passwordErr = passwordRequirements;
const confirmErr = 'Confirmation password must be equal to password';

const validateUser = [
  body('firstname')
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 30 })
    .withMessage(`First name ${lengthErr}`),
  body('lastname')
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 30 })
    .withMessage(`Last name ${lengthErr}`),
  body('email')
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .custom(async (value) => {
      const existingUser = await db.verifyMail(value);
      if (existingUser) {
        throw new Error('A user already exists with this email');
      }
    }),
  body('username')
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage(`Username has ${usernameErr}`)
    .custom(async (value) => {
      const existingUser = await db.verifyUser(value);
      if (existingUser) {
        throw new Error('A user already exists with this username');
      }
    }),
  body('user_password')
    .custom((value) => {
      return passwordValidation(value);
    })
    .withMessage(passwordErr),
  body('confirm_password')
    .custom((value, { req }) => {
      return value === req.body.user_password;
    })
    .withMessage(confirmErr),
];

const signUpPost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('sign-up-form', {
        appObject: appObject,
        title: appObject.title[5],
        user: req.user,
        passwordRequirements: passwordRequirements,
        errors: errors.array(),
      });
    }
    bcrypt.hash(req.body.user_password, 10, async (err, hashedPassword) => {
      // if err, do something
      if (err) {
        console.log(err);
      }
      // otherwise, store hashedPassword in DB
      try {
        const dataNewUser = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          username: req.body.username,
          user_password: hashedPassword,
          id_membership_status: initialStatus,
        };

        await db.insertNewUser(dataNewUser);
        res.redirect('/join_the_club');
      } catch (err) {
        return next(err);
      }
    });
  },
];

async function joinGet(req, res) {
  res.render('join-the-club', {
    appObject: appObject,
    title: appObject.title[8],
  });
}

// join the club POST form validation
const alphaErrJoin = 'must only contain letters.';
const lengthErrJoin = 'must be between 1 and 30 characters.';
const codeErr = 'The code is incorrect.';

const validateUser2 = [
  body('membership_code')
    .trim()
    .isAlpha()
    .withMessage(`Code ${alphaErrJoin}`)
    .isLength({ min: 1, max: 30 })
    .withMessage(`Code ${lengthErrJoin}`)
    .custom((value) => {
      return value === membershipPassword || value === adminPassword;
    })
    .withMessage(codeErr),
];

const joinPost = [
  validateUser2,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('join-the-club', {
        appObject: appObject,
        title: appObject.title[8],
        user: req.user,
        errors: errors.array(),
      });
    }
    if (req.user.id !== undefined) {
      if (req.body.membership_code === membershipPassword) {
        await db.updateStatus(req.user.id);
        res.redirect('/welcome');
      }
      if (req.body.membership_code === adminPassword) {
        await db.updateToAdministrator(req.user.id);
        res.redirect('/welcome');
      }
    }
  },
];

async function welcomePage(req, res) {
  res.render('welcomeUser', {
    appObject: appObject,
    title: appObject.title[6],
    newUser: req.user,
  });
}

async function loginGet(req, res) {
  res.render('login-form', {
    appObject: appObject,
    title: appObject.title[7],
    user: req.user,
    errors: req.session.messages,
  });
}

module.exports = {
  getHomePage,
  signUpGet,
  signUpPost,
  joinGet,
  joinPost,
  welcomePage,
  loginGet,
};
