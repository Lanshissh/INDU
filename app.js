var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const credentials = require('./serviceAccountKey.json');


// const csrfMiddleware = csrf({cookie: true});

var authRouter = require('./routes/auth');
const adminAuthRouter = require('./routes/adminAuth');
const pageRoutes = require('./routes/pageRoutes');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const customersRouter = require('./routes/customers');
const session = require('express-session');

var app = express();


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(csrfMiddleware);

// app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/', pageRoutes);
app.use('/api/products/', productsRouter);
app.use('/api/categories/', categoriesRouter);
app.use('/api/cart/', cartRouter);
app.use('/api/orders/', ordersRouter);
app.use('/customers', customersRouter);
app.use('/adminAuth', adminAuthRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
