var Playlist = function() {
    this._ini = require('../../config/ini');
    this._fs = require('fs');

    
}

Playlist.prototype.le_playlist = function (req, callback) {
    var ini = this._ini,
        fs = this._fs,
        list = [];


    fs.readFile(ini.paths.playlist, 'utf8', function (err, playlist) {

        if (err)
            return callback(true, "");
        
        playlist = playlist.split(ini.delimiter_playlist);


        playlist.forEach(function (video, index, arr) {

            fs.exists(`${ini.paths.videos}${video}`, function(exists){

                if(exists)
                    list.push(`http://${req.headers.host}${ini.paths.play_video}${video}`);
                
                if((playlist.length - 1) == index){
                        callback(false, list);
                }
                
            });

            
            
        });
      
            
        
    });
    
};

// Playlist.prototype.insere = function (nome, callback) {
//     var ini = this._ini,
//         fs = this._fs;

//     fs.writeFile(ini.paths.insercoes, `${decodeURI(nome)}\n`, {flag: "a"},  (err) => {
//         if (err) callback(true);
//         callback(false);
//     });
// };


module.exports = function(){
    return Playlist;
};