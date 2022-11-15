let User = require('../models/userSchema');
let { comsRecentPosts } = require('../middleware/getFeedData');

module.exports.renderLogin = async (req, res, next) => {
    res.render('login')
}
module.exports.login = async (req, res, next) => {
    console.log('working login');
    console.log(req.user);
    res.redirect('/home');
}

module.exports.createUser = async (req, res, next) => {
    let { name, email, username, dob, password, confirmPassword } = req.body;
    if (password !== confirmPassword
        || !password.length) {
        req.flash('err', 'Passwords must match');
        return res.redirect('/');
    }
    let newUser = new User({
        name,
        email,
        username,
        dob
    });
    req.files.forEach(function (element, index) {
        newUser.img.push({ filename: element.filename, path: element.path });
    });
    User.register(newUser, password);
    newUser.save();
    req.login(newUser, function (err) {
        if (err) {
            return next(err);
        };
        req.flash('success', 'You have logged in');
        return res.redirect('/home')
    });
};



module.exports.renderHome = async (req, res, next) => {
    let currentUser = await User.findById("63045cc4c2c7bff258dfbaad");
    let allComs = await currentUser.getComs(currentUser.id)
        .then(data => { return data })
        .catch(err => console.log(err));
    let comFeedData = await comsRecentPosts(allComs)
        .then(data => { return data }).catch(err => console.log(err));
    console.log(comFeedData);
    res.render('home', {comFeedData});
}


