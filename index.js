const { Client, Intents, MessageActionRow } = require('discord.js');
var mysql = require('mysql');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
    console.log("I am ready!");
});
var weryfikowany;
var trwaWeryfikacja = false;
var progress = 0;
var imie;
var wiek;
var klasa;
var profil;
var szkola;
var nazwaSzkoly;
var wiek;
var rangiKlas = ["888125813881462844", "888115708607725578", "888125958748512276", "888126018555089006", "888126067418742794", "888126121709817866", "888126221601361951", "888126265410867211"];
client.on('messageCreate', msg => {

    const channel = client.channels.cache.find(channel => channel.id === "906315390991364166")
    if (trwaWeryfikacja) {
        if (msg.channelId == "906315390991364166" && msg.author == weryfikowany) {
            switch (progress) {
                case 0:
                    imie = msg.content;
                    channel.send("Witaj **" + imie + "** \nTeraz powiedz do jakiej szkoły chdzisz\nUwaga Odpowiedz Liceum/Technikum/Szkoła Podstawowa");
                    progress++;
                    break;
                case 1:
                    switch (msg.content) {
                        case "Liceum":
                            msg.member.roles.add("888112574623797248");
                            szkola = msg.content;
                            channel.send("Teraz słownie napisz nazwę liceum")
                            progress++;
                            break;
                        case "Technikum":
                            msg.member.roles.add("888113043232407592");
                            szkola = msg.content;
                            channel.send("Teraz słownie napisz nazwę technikum")
                            progress++;
                            break;
                        case "Szkoła Podstawowa":
                            msg.member.roles.add("888115713582170212");
                            szkola = msg.content;
                            channel.send("Teraz słownie napisz nazwę szkoły podstawowej")
                            progress++;
                            break;
                        default:
                            channel.send("Nie rozumiem napisz jeszcze raz\n**Uwaga Odpowiedz Liceum/Technikum/Szkoła Podstawowa**")
                            break;
                    }
                    break;
                case 2:
                    nazwaSzkoly = msg.content;
                    channel.send("Przyszedł czas na określenie klasy \n**Napisz tylko numer (bez liter ani innych znaków)**")
                    progress++;
                    break;
                case 3:
                    if (isNum(msg.content)) {
                        klasa = parseInt(msg.content);
                        if (klasa <= 8) {
                            msg.member.roles.add(rangiKlas[klasa - 1]);
                        } else {
                            klasa = 1;
                            msg.member.roles.add(rangiKlas[klasa - 1]);
                        }
                        channel.send("Ile masz lat \n**Napisz tylko numer (bez liter ani innych znaków)**");
                        progress++;
                    } else {
                        channel.send("Nie rozumiem napisz jeszcze raz\n**Tylko numer**")
                    }
                    break;
                case 4:
                    if (isNum(msg.content)) {
                        wiek = parseInt(msg.content);
                        channel.send("Czas na podanie profilu\nJeśli nie masz napisz brak");
                        progress++;
                    } else {
                        channel.send("Nie rozumiem napisz jeszcze raz\n**Tylko numer**")
                    }
                    break;
                case 5:
                    profil = msg.content;
                    msg.member.roles.add("888115649317044306");
                    msg.member.roles.add("888110704907935814");
                    msg.member.roles.remove("906315542854524998");
                    async function clear() {
                        const fetched = await channel.messages.fetch({ limit: 99 });
                        channel.bulkDelete(fetched);
                    }
                    clear();
                    var con = mysql.createConnection({
                        host: "localhost",
                        user: "uname",
                        password: "pass",
                        database: "Somsiady"
                    });

                    con.connect(function(err) {
                        if (err) throw err;
                        console.log("Connected!");
                        var sql = "INSERT INTO weryfikacja (imie,klasa,szkolaTyp,szkolaNazwa,profilKlasy,nick,iddc,wiek) VALUES ('" + imie + "'," + klasa + ",'" + szkola + "','" + nazwaSzkoly + "','" + profil + "','" + msg.author.username + "'," + msg.author + "," + wiek + ")";
                        con.query(sql, function(err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
                        });
                    });
                    msg.author.send("Dziękuje, to wszystko\nMiłego korzystania")
                    trwaWeryfikacja = false
                    progress = 0
            }
        } else {
            if (msg.channelId == "888105494290501684") {
                msg.author.send("Niestety jestem zajety. Spróbuj ponownie za chwilkę.")
            }
        }
    } else {
        if (msg.channelId == "888105494290501684") {
            if (msg.content == "Weryfikuj") {
                if (msg.member.roles.cache.some(r => r.id === "906315542854524998")) {
                    msg.author.send("Jesteś już w trakcie weryfikacji!");
                } else {
                    async function clear() {
                        const fetched = await channel.messages.fetch({ limit: 99 });
                        channel.bulkDelete(fetched);
                    }
                    clear();
                    weryfikowany = msg.author;
                    trwaWeryfikacja = true;
                    msg.member.roles.add("906315542854524998");
                    msg.delete();
                    channel.send("<@" + msg.author + "> \nZadam ci tam kilka pytań. \nOdpowiedz zgodnie z prawdą aby móc przyznać ci odpowiednie rangi \nZa dane niepoprawne zostanie nałożony ban \nPodaj Swoje imię");

                }
            }
        }
    }



});

client.login("TOKEN");

function isNum(val) {
    return !isNaN(val)
}