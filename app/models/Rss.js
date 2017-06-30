var Rss = function () {}

Rss.prototype.le_rss = function (callback) {

    var fs = require('fs');
    var ini = require("../../config/ini");

    try {

        fs.readFile(ini.paths.rss, 'utf8', (err, json_rss) => {
            if (err) {
                console.log(`--> [ERRO] não foi possível fazer a requisição do feed direto no arquivo`);
                return callback(true, {});
            }

            return callback(false, JSON.parse(json_rss));
        });
        
    } catch (err) { 
            console.log(`--> [ERRO] não foi possível fazer a requisição do feed direto no arquivo`);
            return callback(true, {});
    }
};

module.exports = function () {
    return Rss;
};