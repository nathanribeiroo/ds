var Rss = function () {


}

Rss.prototype.le_rss = function (callback) {

    var parser = require('xml2json');
    var request = require('request');
    var ini = require('../../config/ini');

    var valid_callback = 0,
        json = [];

    ini.hosts.forEach((host, index, arr) => {

        request(host, function (error, response, xml) {

            if (error) {
                callback(true, json);
                return;
            }
            var json_rss = JSON.parse(parser.toJson(xml));


            json.push([json_rss.rss.channel.item]);

            valid_callback++;


            if (valid_callback == ini.hosts.length) {
                callback(false, json);
                return;
            }

        });
    });
};

module.exports = function () {
    return Rss;
};