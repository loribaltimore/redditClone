let User = require('../models/userSchema');
module.exports.locals = async (req, res, next) => {
    res.locals.currentUser = await User.findById("63045cc4c2c7bff258dfbaad");
    res.locals.err = req.flash('err');
    res.locals.success = req.flash('success');
    console.log(req.user)
    next();
}