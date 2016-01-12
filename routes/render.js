var config = require('../config.json');

var renderApp = function(req, res) {

    console.log('GET', req.url);

    var configJson = {
      apiUrl: config.host,
      isDev: req.app.get('env') === "development"
    };
    res.render('mainProd', configJson);
};

var renderJSON = function(req, res) {
    res.send({
      message: "Hey! API is up"
    });
};

module.exports = {
  renderApp: renderApp,
  renderJSON: renderJSON
};
