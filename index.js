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
let passport = require('passport');
let LocalStrategy = require('passport-local');
let User = require('./models/userSchema');
let comRouter = require('./controllers/routers/comRouter');
let mongoSanitize = require('express-mongo-sanitize');
let helmet = require('helmet');
let ejsMate = require('ejs-mate');
let flash = require('connect-flash');
let session = require('express-session');
let validator = require('express-validator');
let methodOverride = require('method-override');
let { sessionConfig } = require('./config/sessionConfig');
let userRouter = require('./controllers/routers/userRouter');
let mongoose = require('mongoose');
const { serializeUser, deserializeUser } = require('passport');
let port = (3000 || process.env.port);
let databaseUrl = ('mongodb://localhost:27017/goFast' || process.env.url);

///All Middleware

app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
        directives: {
            'default-src': ['self' ],
    'base-uri': ['self'],
    'font-src': ['self'],
    'form-action': ['self', 'http://localhost:3000/'],
    'frame-ancestors': ['self'],
    'img-src': ['self'],
    'object-src': ['none'],
    'script-src': ['self', 'http://localhost:3000/js/bootstrap.min.js', 'http://localhost:3000/js/scrpt.js'],
    'script-src-attr': ['none'],
        'style-src': ['self',
            'http://localhost:3000/css/bootstrap.min.css',
        'http://localhost:3000/css/styles.css']
        }
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session(sessionConfig));
app.use(flash());
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
app.use('/:userId/communities', comRouter);



