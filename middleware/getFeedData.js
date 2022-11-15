let User = require('../models/userSchema');
let Com = require('../models/comSchema');
module.exports.comsRecentPosts = async (coms) => {
    let comFeedData = {};
    for (let i = 0; i < coms.length; i++){
        let user = await User.findById(coms[i].id);
        comFeedData[coms[i].name] = { name: coms[i].name, post: {} };
        let topPost = await coms[i].getPosts(coms[i].id, 0, 1)
            .then(data => { return data }).catch(err => console.log(err));
        comFeedData[coms[i].name].post = topPost[0];
    }
    return comFeedData;
};
