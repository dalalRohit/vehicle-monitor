require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
const session = require('express-session');

//Routes
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json({
  limit: '16mb'
}));


//Express session middleware
// Express session
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: true,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// connect-flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error-msg');
  next();
})
//Database file
var { mongoose } = require('./db/db');

// view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16mb' }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/temp', express.static(path.join(__dirname, 'temp')))
app.use('/sw', express.static(path.join(__dirname, './sw.js')))

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
