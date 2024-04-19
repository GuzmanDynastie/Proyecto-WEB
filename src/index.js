const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

// Initilizations
const app = express();
require('./config/database');

// Settings
app.set('port', process.env.PORT || 3000);

// Configuration of the Handlebars template engine
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.html'
}));
app.set('view engine', '.html');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

// Routes
app.use(require('./routes/adminRegister'));
app.use(require('./routes/homeAdmin'));
app.use(require('./routes/home'));
app.use(require('./routes/payment'));
app.use(require('./routes/product'));
app.use(require('./routes/shipping'));
app.use(require('./routes/shop'));
app.use(require('./routes/shopping_cart'));
app.use(require('./routes/userRegister'));
app.use(require('./routes/userLogin'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../')));

// Server is listening
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});