let User = require('../userSchema');
let Post = require('../postSchema');
let { names } = require('./seedNames');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/goFast')
    .then(data => console.log('Seeding Database is Live'))
    .catch(err => console.log(err));

let createNewUser = async (req, res, next) => {
    let rand = Math.floor(Math.random() * names.length - 1) + 1;
    let name = names[rand];
    console.log(name);
    let newUser = await new User({
        username: name + '5',
        email: `${name}@gmail.com`,
        name: name,
        dob: Date.now(),
        img: [
            {
                filename: 'gofast/kkvsbpq48qvhm4ecg3no',
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1661183237/gofast/kkvsbpq48qvhm4ecg3no.jpg',
            },
            {
                filename: 'gofast/qivsakuvw9mzgqnqvydx',
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1661183237/gofast/qivsakuvw9mzgqnqvydx.jpg',
            }
        ]
    });
    User.register(newUser, 'dev');
    await newUser.save();
    return newUser;
};

let seedFriends = async (req, res, next) => {
    // await User.deleteMany({});
    let currentUser = await User.findById("63045cc4c2c7bff258dfbaad");
    for (let i = 0; i < 10; i++) {
        let newUser = await createNewUser()
            .then(data => { return data })
            .catch(err => console.log(err));
        newUser.friendId = mongoose.Types.ObjectId();
        currentUser.friends.push(newUser.friendId);
    };
    await currentUser.save();
    console.log(currentUser.friends);
};

// seedFriends();
let createPost = async (friendId) => {
    let newPost = await new Post({
        text: 'this is a test',
        img: [
            {
                filename: 'gofast/gfbzw7viipg9eqopwpk9',
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1661230276/gofast/gfbzw7viipg9eqopwpk9.jpg',
            }
        ],
        author: friendId,
    }).save();
    return newPost
}

let seedPosts = async (req, res, next) => {
    let allUsers = await User.find({});
    allUsers.forEach(async (element, index) => {
        let newPost = await createPost(element.friendId)
            .then(data => { console.log(data); return data }).catch(err => console.log(err));
        element.createdPosts.push(newPost.id);
        await element.save();
    });
};
for (let i = 0; i < 5; i++){
    seedPosts();
}
