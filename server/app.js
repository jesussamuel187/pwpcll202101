var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup       //(hbs= halderbals)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));    // es para que nos muestren las peticiones que hacen.
app.use(express.json());  // comvierte el http a formato json.(es un conversor )
app.use(express.urlencoded({ extended: false }));   //para todas las peticiones de url.
app.use(cookieParser());   //manejo de cookies
app.use(express.static(path.join(__dirname, 'public')));  //este es uno de los mas importates

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
