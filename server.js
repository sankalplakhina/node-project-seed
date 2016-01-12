// Require our dependencies
var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    config = require('./config.json');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || config.port || 4000;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use("/public/", express.static(__dirname + "/public/"));
app.use("/", express.static(__dirname + "/")); // remove this when going for production deployment

// Load core-routes express routes by passing express instance
var coreRoutes = require('./routes/core-routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});