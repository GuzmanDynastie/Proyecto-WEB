const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const cors = require('cors');

const os = require('os');
const networkInterfaces = os.networkInterfaces();
let ipAddresses = [];

for (let interface in networkInterfaces) {
  for (let alias of networkInterfaces[interface]) {
    if (alias.family === 'IPv4' && !alias.internal) {
      ipAddresses.push(alias.address);
    }
  }
}

const whiteList = ipAddresses.flatMap(ip => [
  `http://${ip}:3000`,
  `http://${ip}:3001`
]);

Handlebars.registerHelper('lt', function (a, b) {
  return a < b;
});

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// Initilizations
const app = express();
require('./config/database');

// Settings
app.set('port', process.env.PORT || 5000);
app.use(cors({
  origin: whiteList,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

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
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL, // URL de conexión a MongoDB
    dbName: process.env.TARGET_DB // Nombre de la base de datos
  })
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
app.use(require('./routes/403'));
app.use(require('./routes/addAdmin'));
app.use(require('./routes/addDiscrepance'));
app.use(require('./routes/addProduct'));
app.use(require('./routes/adminDelete'));
app.use(require('./routes/discrepance'));
app.use(require('./routes/home'));
app.use(require('./routes/homeAdmin'));
app.use(require('./routes/payment'));
app.use(require('./routes/product'));
app.use(require('./routes/productOption'));
app.use(require('./routes/shipping'));
app.use(require('./routes/shop'));
app.use(require('./routes/shopping_cart'));
app.use(require('./routes/userLogin'));
app.use(require('./routes/userRegister'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../')));

// Server is listening
app.listen(app.get('port'), () => {
  console.log(`Servidor en el puerto ${app.get('port')}`);
  ipAddresses.forEach(ip => {
    console.log(`Accede a la API desde ---> http://${ip}:${app.get('port')}`);
  });
});