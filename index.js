if (process.env.NODE_env !== 'production') {
    require('dotenv').config();
};
///All Declatrations
let express = require('express');
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let ejs = require('ejs');
let cors = require('cors');
let passport = require('passport');
let LocalStrategy = require('passport-local');
let User = require('./models/userSchema');
let mongoSanitize = require('express-mongo-sanitize');
let helmet = require('helmet');
let ejsMate = require('ejs-mate');
let flash = require('connect-flash');
let session = require('express-session');
let validator = require('express-validator');
let methodOverride = require('method-override');
let { sessionConfig } = require('./config/sessionConfig');
let userRouter = require('./controllers/routers/userRouter');
let comRouter = require('./controllers/routers/comRouter');
let postRouter = require('./controllers/routers/postRouter');
let mongoose = require('mongoose');
const { serializeUser, deserializeUser } = require('passport');
let port = (3000 || process.env.port);
let databaseUrl = ('mongodb://localhost:27017/goFast' || process.env.url);

///All Middleware
app.use(cors())
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(cors());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        'default-src': ['self', 'http://localhost:3000/'],
        'connect-src': ['http://localhost:3000/'],
        'base-uri': ['self'],
        'font-src': ['self',],
        'form-action': ['self', 'http://localhost:3000/'],
        'frame-ancestors': ['self'],
        'img-src': ['self', 'https://res.cloudinary.com/'],
        'object-src': ['none'],
        'script-src': ['self',
            'http://localhost:3000/js/bootstrap.min.js',
            'http://localhost:3000/js/scrpt.js',
            "'nonce-75'",
            'https://unpkg.com/',
            // (req, res) => {
            //     console.log(res.locals.nonce)
            //     return `'nonce-${res.locals.nonce}'`
            // }
        ],
        'script-src-attr': ['none', 'nonce-75'],
        'style-src': [
            'http://localhost:3000/css/bootstrap.min.css',
            'http://localhost:3000/css/styles.css',
            "'nonce-75'",
            // (req, res) => {
            //     return `'nonce-${res.locals.nonce}'`
            // }
        ]
    }
}));
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session(sessionConfig));
app.use(flash());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(passport.initialize());
passport.session(sessionConfig);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////Running Server and Database
mongoose.connect(databaseUrl)
    .then(data => console.log('Database is Live'))
    .catch(err => next(err));

app.listen(port, () => {
    console.log(`Server is Live on ${port}`);
});


app.use('/', userRouter);
app.use('/:userId/com/:comName', comRouter);
app.use('/:userId/com/:comName/posts/:postId', postRouter)




