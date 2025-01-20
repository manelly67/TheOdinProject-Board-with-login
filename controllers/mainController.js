const db = require('../db/queries');
const { appObject } = require('../appTitles');

const myObject = {};
require('dotenv').config({ processEnv: myObject });

async function getHomePage(req, res) {
  
  res.render('index', {
    appObject: appObject,
    title: appObject.title[0],
    user: req.user,
    /* categoryIndex: 'get',
    deleteCategMessage: undefined,
    needCredential: false, */
  });
}


module.exports = {
    getHomePage,
   
  };