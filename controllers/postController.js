let Post = require('../models/postSchema');
let Com = require('../models/comSchema');
let User = require('../models/userSchema');
const { lavenderblush } = require('color-name');
// let { session } = require('../middleware/session');

class Comment{
    constructor(text, author, post) {
        this.text = text;
        this.author = author;
        this.createdAt = Date.now();
        this.post = post;
    }
}

module.exports.renderPost = async (req, res, next) => {
    console.log(req.query);
    let { postId, userId, comName } = req.params;
    let currentPost = await Post.findById(postId);
    let currentUser = await User.findById(userId);
    let currentCom = await Com.findOne({ name: comName });
    console.log(currentPost.img[0].path)
    res.render('post', {currentPost, currentCom});
}


module.exports.updatePost = async (req, res, next) => {
    let { userId, comName, postId } = req.params;
    let { increment } = req.body;
    comName = comName.split('_').join(' ');
    let currentUser = await User.findById(userId);
    let currentPost = await Post.findById(postId);
    let currentCom = await Com.findOne({ name: comName });
    console.log(req.session.allPostSessionData)
    Object.keys(req.session.allPostSessionData.posts).forEach(async (element, index) => {
        let thisPost = await Post.findById(element);
        thisPost.comments.push(...req.session.allPostSessionData.posts[element].comments);
        thisPost.likes += req.session.allPostSessionData.posts[element].likes;
        currentUser.comments.push(...req.session.allPostSessionData.posts[element].comments)
        await thisPost.save();
    });
    await currentUser.save();
    res.send(
        "nice"
        // `Post ${currentPost.id} from ${beforeLikes} to ${afterLikes}, by ${currentUser.username}`
    );
};

// module.exports.addComment = async () => {
//     let { postId, userId } = req.params;
//     let { commentBody } = req.body;
//     let currentUser = await User.findById(userId);
//     let currentPost = await Post.findById(postId);
// let newComment = new Comment()
// }

module.exports.deleteComment = async (req, res, next) => {
    let { postId, userId } = req.params;
    let { comment } = req.body;
    let currentPost = await Post.findById(postId);
    let currentUser = await User.findById(userId);
    currentPost.comments.filter(x => x.id === comment.id);

}