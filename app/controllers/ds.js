module.exports.index = function(application, req, res){

    var playlist = new application.app.models.Playlist();
    
    playlist.le_playlist(req, function (err, playlist) {

        if(err)
            return;

        var insere = application.config.db;

        insere.serialize(function(){

            insere.all(`
                SELECT horario_exibicao.horario, videos.video
                FROM horario_exibicao 
                INNER JOIN videos 
                ON horario_exibicao.id_video=videos.id
                ORDER BY horario_exibicao.horario ASC`,
                
                function(err, playlist_horario) {

                    res.render("index", {
                        ini: application.config.ini,
                        url : req.headers.host,
                        playlist: playlist,
                        playlist_horario: playlist_horario,
                        sleep: { 
                            feed: application.config.ini.sleep_feed, 
                            clima: application.config.ini.sleep_clima
                        }
                    });
            });

        });
        

    });

	
}

module.exports.rss = function(application, req, res){
    res.render("rss");
}

module.exports.feed = function(application, req, res){

    var rss = new application.app.models.Rss();

    rss.le_rss(function (erro, data){

        if(erro) {
            return res.json();
        }
        

        return res.json(data.rss.channel.item);
    });
        
}

module.exports.insere = function (application, req, res) {

    let { NAME } = req.params;

    var insere = application.config.db;

    insere.serialize(function(){

        insere.each(`SELECT id FROM videos WHERE video = '${NAME}'`, function(err, row) {
            insere.run(`INSERT INTO insercoes (id_video) VALUES ('${row.id}')`);
        });
    });

   
    res.send('');

}

module.exports.weather = function (application, req, res) {

    var request = require('request');
    var host = `http://api.hgbrasil.com/weather/?format=jsonp&city_name=${encodeURI(application.config.ini.weather.cidade)}&key=${encodeURI(application.config.ini.weather.key)}`;
    
    request(host, function (error, response, body) {

        if(error) {

            res.send('-1');
            return;
        }

        res.json(body);
    });


}
