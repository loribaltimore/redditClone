let mongoose = require('mongoose');
let { model, Schema } = mongoose;
let User = require('./userSchema');

let postSchema = new Schema({
    text: {
        type: String,
    },
    img: [
        {
            filename: {
                type: String
            },
            path: {
                type: String
            }
        }
    ],
    author: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    sort: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: Object
        }
    ]
});

postSchema.method('removePost', async (auth) => {
    this.sort = 1;
    let author = await User.findOne({ friendId: auth });
    let allPosts = author.createdPosts.sort((a, b) => a - b);
    allPosts.pop();
    await author.save();
}, this)

let Post = model('post', postSchema);

module.exports = Post;
