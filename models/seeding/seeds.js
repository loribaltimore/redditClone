let User = require('../userSchema');
let Post = require('../postSchema');
let { names } = require('./seedNames');
let mongoose = require('mongoose');
const Com = require('../comSchema');
let casual = require('casual');
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
    await Post.deleteMany({ text: 'this is a test' });

    let creators = [
    '63045c9d83c6c01f5a5aeff0',
  '63045ca5c2c7bff258dfbaaa',
  '63045cf6c33eba5ce23b72ae',
  '63045cf6c33eba5ce23b72ae',
  '63045cf6c33eba5ce23b72ae',
        '63045cf6c33eba5ce23b72ae'];
    
    let randomCreator = Math.floor(Math.random() * (creators.length - 1) + 1);
    let newPost = await new Post({
        text: casual.sentence,
        img: [
            {
                filename: 'gofast/gfbzw7viipg9eqopwpk9',
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1661230276/gofast/gfbzw7viipg9eqopwpk9.jpg',
            }
        ],
        author: (friendId || creators[randomCreator]),
    }).save();
    return newPost
}
// for (let i = 0; i < 5; i++){
//     createPost();
// }


let seedPosts = async (req, res, next) => {
    let allUsers = await User.find({});
    let allComs = await Com.find({});
    allComs.forEach(async (element, index) => {
        let newPost = await createPost(allUsers[index].friendId)
            .then(data => { console.log(data); return data }).catch(err => console.log(err));
        allUsers[index].createdPosts.push(newPost.id);
        await allUsers[index].save();
        element.posts.push(newPost.id);
        await element.save();
    });
};
// for (let i = 0; i < 5; i++){
//     seedPosts();
// }

let createComs = async () => {
    let cats = ['politics', 'comedy', 'philosophy', 'academic', 'music', 'movies', 'art', 'news'];
    let randomCat = Math.floor(Math.random() * (cats.length - 1) + 1);
    let currentUser = await User.findById("63045cc4c2c7bff258dfbaad");
    let newCom = await new Com({
        name: casual.title,
        img: [
            {
                filename: 'gofast/gfbzw7viipg9eqopwpk9',
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1661230276/gofast/gfbzw7viipg9eqopwpk9.jpg',
            }
        ],
        members: [
            {userId: '63045c9d83c6c01f5a5aeff4',
            sort: 0},
            {userId: '63045cc4c2c7bff258dfbaad',
            sort: 0},
            {userId: '63045cf6c33eba5ce23b72b1',
            sort: 0},
            {userId: '63045cf6c33eba5ce23b72b7',
            sort: 0},
            {userId: '63045cf6c33eba5ce23b72bd',
            sort: 0},
            {userId: '63045cf6c33eba5ce23b72c3',
            sort: 0},
            {userId: '63045cf6c33eba5ce23b72c9',
            sort: 0},
        ],
        banned: [],
        posts: [],
        auth: {
            allAdmin: [{ userId: currentUser.id, sort: 0 }]
        },
        createdBy: currentUser.id,
        category: cats[randomCat],
        description: casual.short_description,
        rules: [
            casual.sentence,
            casual.sentence,
            casual.sentence,
        ]
    }).save();
    console.log('COMS created');
};
// for (let i = 0; i < 10; i++){
//     createComs();
// };


let seedComs = async (req, res, next) => {
    let currentUser = await User.findById("63045cc4c2c7bff258dfbaad");
    let allComs = await Com.find({});
    allComs.forEach(function (element, index) {
        currentUser.coms.push(element.id);
    });
    await currentUser.save();
    console.log(currentUser.coms);
};


let deleteAll = async () => {
    await Post.deleteMany({});
    await Com.deleteMany({});
    console.log('Posts and Coms Deleted');
}
// // seedComs();

class Comment{
    constructor(text, author, createdAt, post) {
        this.text = text;
        this.author = author;
        this.createdAt = createdAt;
        this.post = post;
    }
}

let seedEngagement = async (req, res, next) => {
    let allPosts = await Post.find({});
    let allUsers = await User.find({});
    allPosts.forEach(async (element, index) => {
        let randUser = allUsers[Math.floor((Math.random() * allUsers.length - 1) + 1)];
        let randLikes = Math.floor(Math.random() * 50 + 1)
        element.likes = randLikes;
        let newComment = new Comment(
            casual.sentence,
            { name: randUser.name, userId: randUser.id },
            Date.now(),
            element.id
        );
        element.comments.push(newComment);
        // randUser.comments.push(newComment);
    
        await element.save();
        // await randUser.save();
        console.log(newComment);
    });
};
seedEngagement();

let reseed = async (req, res, next) => {
    let allPosts = await Post.find({});
    allPosts.forEach(async(element, index) => {
        element.comments = [];
        await element.save();
        console.log(element)

    })
};
// reseed();












  