const { threadId } = require('worker_threads');
let { updatePost } = require('../controllers/postController');
let User = require('../models/userSchema');
class Comment{
    constructor(text, author, post) {
        this.text = text;
        this.author = author;
        this.createdAt = Date.now();
        this.post = post;
    }
}

class postSessionData{
    constructor(postId, userId, likes = 0, comments = []) {
        this.postId = postId;
        this.userId = userId;
        this.likes = likes;
        this.comments = comments;
    };
};

class allPostSessionData{
    constructor(startTime = Date.now(), posts = {}) {
        this.startTime = startTime;
        this.posts = posts
    }
};

module.exports.sessionTimer = async (req, res, next) => {
    if (!req.session.sessionTimer) {
        req.session.sessionTimer = Date.now();
    } else {
        if (Date.now() - req.session.sessionTimer >= 300000) {
            if (req.session.allPostSessionData &&
                Object.keys(req.session.allPostSessionData).length) {
                await updatePost(req, res, next)
                    .then(data => console.log(data))
                    .catch(err => console.log(err));
            }
        }
        req.sessionTimer = Date.now();
    };
    next();
};

let commentBuilder = async (comment, user, postId) => {
    let newComment = new Comment(comment, user, postId);
    return newComment;
}

module.exports.updatePostSession = async (req, res, next) => {
    let { userId, postId, comName } = req.params;
    let { increment, commentBody } = req.body;
    let currentUser = await User.findById(userId);

    if (!req.session.allPostSessionData) {
        req.session.allPostSessionData = new allPostSessionData();
    };
    if (!req.session.allPostSessionData.posts[postId]) {
        req.session.allPostSessionData.posts[postId] = new postSessionData(postId, userId);
    };
    if (increment && currentUser.likedPosts.indexOf(postId) === -1) {
        req.session.allPostSessionData.posts[postId].likes += increment
    } else if (commentBody) {
        let newComment = await commentBuilder(commentBody, { name: currentUser.name, userId: userId }, postId)
            .then(data => { return data }).catch(err => console.log(err));
        req.session.allPostSessionData.posts[postId].comments.push(newComment);
        req.flash('success', 'Comment Added');
    } else { console.log('already liked, can only comment') };
    console.log(req.params);
    setTimeout(async() => {
        await updatePost(req, res, next)
        .then(data => console.log(data))
.catch(err => console.log(err));
    }, 120000)
    res.redirect(`/${userId}/com/${comName}/posts/${postId}`);
};

///work out the session. Displaying things quickly, but bundling them to save space.
///user can delete own comment


///session just needs to collect every post and differentiate between liked and disliked
///then you can update them all at once every so often.
///waste of time for project, great practice for session and OOP

///add comment capabilities.
///store liked/commented posts as an object for easy traversal and search
///is it possible to have all session updating functionality as methods in the session data objects?