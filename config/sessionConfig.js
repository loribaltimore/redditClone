let MongoStore = require('connect-mongo');
let mongoStorage = MongoStore.create({
    mongoUrl: process.env.MONGO_ATLAS
});
module.exports.sessionConfig = {
    name: 'exampleSessionName',
    store: process.env.NODE_env !== 'production' ?
        '': mongoStorage,
    secret: ['secret1', 'secret2', 'secret3'],
    saveUninitialized: true,
    resave: false,
    cookie: {
        sameSite: true,
        secure: process.env.NODE_env !== 'production' ?
            false : true,
        maxAge: 604800000
        ///session Config Refresher
    }
};
