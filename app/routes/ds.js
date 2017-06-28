module.exports = function(application){

    application.get('/', function(req, res){
        application.app.controllers.ds.index(application, req, res);
    });

    application.get('/weather', function(req, res){
        application.app.controllers.ds.weather(application, req, res);
    });

    application.get('/insere/:NAME', function(req, res){
        application.app.controllers.ds.insere(application, req, res);
    });

    application.get('/feed', function(req, res){
        application.app.controllers.ds.feed(application, req, res);
    });

    application.get('/rss', function(req, res){
        application.app.controllers.ds.rss(application, req, res);
    });
}