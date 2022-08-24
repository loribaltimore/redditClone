let User = require('../models/userSchema');
module.exports.comsRecentPosts = async (coms) => {
    let comFeedData = {};
    for (let i = 0; i < coms.length; i++){
        let user = await User.findById(coms[i].id);
        friendFeedData[coms[i].username] = { username: coms[i].username, post: {} };
        let topPost = await user.recentPosts(coms[i].id, 1)
        .then(data => { return data }).catch(err => console.log(err));
        friendFeedData[coms[i].username].post = topPost[0];
    }
    return comFeedData;
};
