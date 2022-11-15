let mongoose = require('mongoose');
let Post = require('./postSchema');
let Com = require('./comSchema');
let { model, Schema } = mongoose;
let passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    memberSince: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        require: true,
        min: 1,
        max: 12
    },
    dob: {
        type: Date,
        required: true
    },
    img: [
        {
            filename: {
                type: String,
            },
            path: {
                type: String
            }
        }
    ],
    createdPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    likedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    comments: [
        {
            type: Object
        }
    ],
    totalLikes: {
        type: Number,
        min: 0,
        default: 5
    },
    coms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'com'
        }
    ],
    friendId: {
        type: String,
    },
    auth: {
        isAdmin: {
            type: Boolean,
            default: false
        },
        communities: [
            {
                type: Schema.Types.ObjectId,
                ref: 'community'
            }
        ]
    },
    allComs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'community'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

userSchema.virtual('userTag').get(function() {
    let currentUser = this;
    return `${currentUser.username} ${currentUser.totalLikes}`
});

userSchema.method('getComs', async (id, start = 0, num = 10) => {
    let currentUser = await User.findById(id);
    let allComs = await currentUser.populate({ path: 'coms' })
        .then(data => { return data.coms }).catch(err => console.log(err));
    if (currentUser.coms.length < num) {
        return allComs;
    } else {
        return allComs.slice(0, num);
    } 
});

userSchema.method('recentPosts', async (id, amount) => {
    let currentUser = await User.findById(id);
    let recentPosts = await currentUser.populate({ path: 'createdPosts' })
        .then(data => { return data.createdPosts.slice(0, amount)})
        .catch(err => console.log(err));
    return recentPosts;
});

let User = model('user', userSchema);

module.exports = User;