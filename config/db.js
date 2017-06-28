
// var ini - variaveis globais 
var ini = require("./ini");

// var sqlite3 - carrega o modulo do banco sqlite
var sqlite3 = require('sqlite3').verbose();

// cria uma instancia do banco, se não existir ele cria o arquivo do banco de dados
var db = new sqlite3.Database(ini.paths.database);

/**
 * Lê um txt passado como parametro, retornando uma lista em um array pelo callback
 * @param {*} path 
 * @param {*} callback 
 */
var lista = function (path, callback) {
    
    var fs = require('fs'),
        list = [];
        
    fs.readFile(path, 'utf8', function (err, playlist) {

        if (err)
            return callback(true, "");
        
        playlist = playlist.split(ini.delimiter_playlist);

        playlist.forEach(function (video, index, arr) {

            list.push(video);
        });
        
        callback(false, list);    
        
    });
    
};

var cria_tabelas = function(callback) {
    console.info("--> Criando tabelas do banco de dados..."); 

    db.serialize(function() {
         db.run(`CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                video TEXT NOT NULL UNIQUE
                )`
        );

        db.run(`CREATE TABLE IF NOT EXISTS insercoes (
                id_video INTEGER NOT NULL,
                criacao DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
                FOREIGN KEY(id_video) REFERENCES videos(id)
                )`
        );

        db.run(`CREATE TABLE IF NOT EXISTS horario_exibicao (
                id_video INTEGER NOT NULL,
                horario DATETIME PRIMARY KEY,
                FOREIGN KEY(id_video) REFERENCES videos(id)
                )`
        );


       callback(); 
    });

};

var insere_videos = function (callback) {
    console.info("--> Inserindo novos vídeos da playlist no banco de dados..."); 
    lista(ini.paths.playlist, function (err, data) {

        db.serialize(function() {

            var stmt = db.prepare("INSERT OR IGNORE INTO videos (video) VALUES (?)");

            data.forEach( function(video, index){
                stmt.run(video);
                //.replace(/^.*\/|\.[^.]*$/g, '')
                if((data.length - 1) == index){
                    stmt.finalize();
                    callback();
                }
            });
                
        });
    });
};

var insere_horarios = function (callback) {    

    console.info("--> Inserindo horários de execução dos vídeos no banco de dados...");
    lista(ini.paths.playlist_horario, function (err, data_horario) {
        db.serialize(function() {
            
            data_horario.forEach( function(video, index_video){

                var info_video = video.split(" ");
                var nome_video = info_video[0];
                info_video.shift();
                
                db.run(`INSERT OR IGNORE INTO videos (video) VALUES ('${nome_video}')`);

                db.each(`SELECT id FROM videos WHERE video = '${nome_video}'`, function(err, row) {

                    info_video.forEach( function(horario, index_horario){
                        db.run(`INSERT OR IGNORE INTO horario_exibicao (id_video, horario) VALUES (${row.id}, '${horario}')`);

                        if(((info_video.length - 1) == index_horario) && (data_horario.length - 1) == index_video){
                            callback();
                        }

                    });
                    
                });

            });

        });
    });
};

cria_tabelas(() => {
    console.info("--> Tabelas do banco de dados criadas com Sucesso");

    insere_videos(() => {
        console.info("--> Novos vídeos inseridos com Sucesso");

        insere_horarios(() => {
            console.info("--> Horários de execução dos vídeos inseridos com Sucesso");  
        });
    });
});


module.exports = function () {
    return db;        
};