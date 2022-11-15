let User = require('../models/userSchema');
let crypto = require('crypto');
module.exports.locals = async (req, res, next) => {
    res.locals.currentUser = await User.findById("63045cc4c2c7bff258dfbaad");
    res.locals.nonce = crypto.randomBytes(16).toString('hex');
    res.locals.err = req.flash('err');
    res.locals.success = req.flash('success');
    
    next();
}