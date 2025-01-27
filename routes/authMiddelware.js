const { appObject } = require('../appTitles');

module.exports.isAuth = (req,res,next) => {
    if (req.isAuthenticated()) {
        next();
    }else{
        res.redirect('/');
    }
};


module.exports.isAdmin = (req,res,next) => {
    const status = Number(req.user.id_membership_status);
    if (status===1) {
        next();
    }else{
        res.redirect('/');
    }
    
};

module.exports.clearMessages = (req,res,next) => {
    req.session.messages = null;
    next();
};

module.exports.loginRequired = (req,res,next) => {
    if (req.isAuthenticated()) {
        next();
    }else{
        res
    .status(401)
    .render('401', { 
        appObject: appObject, 
        title: appObject.title[12], 
        msg:'You need to login to write a message', 
        });    
    }
};