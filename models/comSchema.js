let mongoose = require('mongoose');
let Post = require('./postSchema');
const User = require('./userSchema');
let { model, Schema } = mongoose;

let comSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 30
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
    members: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            sort: {
                type: Number,
                default: 0
            }
        }
    ],
    banned: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            sort: {
                type: Number,
                default: 0
            }
        }
    ],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    auth: {
        allAdmin: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                },
                sort: {
                    type: Number,
                    default: 0
                }
            }
        ]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
        enum: ['politics', 'comedy', 'philosophy', 'academic', 'music', 'movies', 'art', 'news'],
        required: true
    },
    description: {
        type: String,
        required: true,
        min: 10,
        max: 100
    },
    rules: [
        {
            type: String,
            required: true
        }
    ]
});

comSchema.virtual('totalMembers').get(async (comId) => {
    let currentCom = await Comment.findById(comId);
    return currentCom.members.length
});

comSchema.method('ban', async (comId, userId) => {
    let currentCom = await Comment.findById(comId);
    let userToBan = await User.findById(userId);
    currentCom.members.sort(function (a, b) {
        return a.sort - b.sort
    });
    currentCom.members.pop();
    currentCom.banned.push(userId);
    await currentCom.save();
});

let Com = model('com', comSchema);

module.exports = Com;