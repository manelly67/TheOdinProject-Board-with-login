const db = require('../db/queries');
const { appObject } = require('../appTitles');
const { body, validationResult } = require('express-validator');

async function membersBoardGet(req, res) {
  const messages = await db.getAllMessages();
  res.render('members-board', {
    appObject: appObject,
    title: appObject.title[10],
    user: req.user,
    messages: messages,
  });
}

async function adminBoardGet(req, res) {
  const messages = await db.getAllMessages();
  res.render('admin-board', {
    appObject: appObject,
    title: appObject.title[11],
    user: req.user,
    messages: messages,
  });
}

async function newMessageGet(req, res) {
  res.render('new-message', {
    appObject: appObject,
    title: appObject.title[4],
    user: req.user,
  });
}

// validate for new messages
const textErr = 'must be less than 100 characters.';

const validateMessage = [
  body('textm')
    .trim()
    .notEmpty()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage(`Message ${textErr}`),
];

const newMessagePost = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('new-message', {
        appObject: appObject,
        title: appObject.title[4],
        user: req.user,
        errors: errors.array(),
      });
    }
    const { textm } = req.body;
    const added = new Date();
    const messageToAdd = {
      textm: textm,
      id_author: res.locals.currentUser.id,
      added: added.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }),
    };

    await db.insertMessage(messageToAdd);
    res.redirect('/');
  },
];

// login to redirect new message view
async function askForLogin(req, res) {
  res.render('login-for-write', {
    appObject: appObject,
    title: appObject.title[7],
    user: req.user,
    errors: req.session.messages,
  });
}

async function messageDeletePost(req, res) {
  const { id } = req.params;
  await db.deleteMessage(id);
  res.redirect('/');
}

module.exports = {
  membersBoardGet,
  adminBoardGet,
  newMessageGet,
  newMessagePost,
  askForLogin,
  messageDeletePost,
};
