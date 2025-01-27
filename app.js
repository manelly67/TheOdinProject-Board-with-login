const path = require('node:path');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const pgPool = require('./db/pool');
const appRoutes = require('./routes/appRoutes');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');

const { appObject } = require('./appTitles');
const myObject = {};
require('dotenv').config({ processEnv: myObject });

// express app
const app = express();
// to define the view engine and path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//We are not actually going to be using express-session directly,
//it is a dependency that is used in the background by passport.js
app.use(
  session({
    store: new pgSession({
      pool: pgPool, // Connection pool
      tableName: 'user_sessions', // Use another table-name than the default "session" one
      // Insert connect-pg-simple options here
      createTableIfMissing: true,
    }),
    // Insert express-session options here
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day - 24hrs/1day - 60min/1hrs - 60seg/1min - 1000ms/1seg
    },
  })
);

// se debe inicializar cada sesion
app.use(passport.initialize());
app.use(passport.session());

// middleware and to serve static assets
app.use(express.static('public'));

//si no se utiliza esta middleware el post object resulta undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If you insert this code somewhere between
//where you instantiate the passport middleware and before you render you views
//you will have access to the currentUser variable in all of your views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use('/', appRoutes);

//404 page
app.use((req, res) => {
  res
    .status(404)
    .render('404', { appObject: appObject, title: appObject.title[1] });
});

app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
});
