module.exports = {

    // porta servidor
    // sync_projeto -s1 -uroot -ppi -P22 -H192.168.0.164 -o /node/ds/ -d /usr/local/bin/ds/ -e .gitignore
    porta: 3000,

    // clima tempo
    weather: {
        key: "d8453ec2", //chave
        cidade: "Sao Paulo" // local
    },

    // minutos
    sleep_feed: 5,

    // minuto
    sleep_clima: 1,

    paths: {
        database: "./config/db.sqlite",
        videos: "./app/public/videos/",
        play_video: "/videos/",
        playlist: "./app/public/videos/PLAYLIST",
        ignore: "./app/public/videos/IGNORE",
        playlist_horario: "./app/public/videos/PLAYLIST#HORARIO"
    },

    delimiter_playlist: "\n",

    hosts: [
        "http://rss.home.uol.com.br/index.xml"
        //"http://pox.globo.com/rss/g1/brasil/"
        //"http://www.curitiba.pr.gov.br/include/handler/rss.ashx?feed=4",
        // "http://www.curitiba.pr.gov.br/include/handler/rss.ashx?feed=1"
    ]
};
