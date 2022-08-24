let Com = require('../models/comSchema');
let User = require('../models/userSchema');
module.exports.renderCreateCom = async (req, res, next) => {
    res.render('createCom');
};

module.exports.createCom = async (req, res, next) => {
    console.log('createCom is working');
    console.log(req.body);
    let { userId } = req.params;
    let currentUser = await User.findById(userId);
    let { name, desc, category, rules } = req.body;
    let newCom = await new Com({
        name: name,
        createdBy: userId,
        description: desc,
        members: [{ userId }],
        auth: {
            allAdmin: [{ userId }],
        },
        category: category,
        rules: rules
    });
    req.files.forEach(function (element, index) {
        newCom.img.push({ filename: element.filename, path: element.path });
    });
    await newCom.save();
    console.log(newCom);
    res.redirect('/home');
};
