const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dbservices = require('./database/services');

const categoriesRoute = require('./routes/categories');
const globalCategoriesRoute = require('./routes/globalCategory');
const productsRoute = require('./routes/products');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', globalCategoriesRoute);
app.use('/categories/', categoriesRoute);
app.use('/products/', productsRoute)

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

dbservices.testConnection()
    .then(result => {
      console.log(result.message);
    })
    .catch(err => {
      console.error('Не вдалося підключитися до бази даних. Перевірте налаштування .env файлу:', err.message);
    });

module.exports = app;
