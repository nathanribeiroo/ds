var app = require('./config/server');

var server = app.listen(app.config.ini.porta, function(){
    console.log('--> Serviço http online');
});