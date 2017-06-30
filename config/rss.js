var events = require('events'); // lib para criar emitir um evento
var parser = require('xml2json'); // converte xml em json
var request = require('request'); // faz requisição a uma determinada url trazendo os dados da pagina
var ini = require('./ini'); // configurações do sistema
var fs = require('fs'); // para ler e escrever arquivos

// instancia um obj de eventos
var thread = new events.EventEmitter();


thread.on('load', () => {
    ini.hosts.forEach((host, index, arr) => {
        request(host, function (error, response, xml) {

            if (error) {
                console.log(`--> [ERRO] não foi possível fazer a requisição do feed: ${host}`);
                return false;
            }

            try {

                fs.writeFile(ini.paths.rss, `${parser.toJson(xml)}`, { flag: "w" }, (err) => {

                    if (err){
                        console.log(`--> [ERRO] não foi possível escrever no arquivo: ${host}`);
                        return false;
                    }
                    

                    console.log(`--> [OK] feed criado com sucesso`);
                });

            } catch (err) {
                console.log(`--> [ERRO] xml mal formatado: ${host}`);
                return false;
            }

        });
    });
});

thread.emit('load');

setInterval(() => {
    thread.emit('load');
}, ini.sleep_feed * (60 * 1000));

