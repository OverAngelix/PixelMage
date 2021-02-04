const express = require('express');
const app = express();
const maxround = 2;
const timeRound = 60;

var map = new Map();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, function () {
    console.log('server running on port '+PORT);
});


const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', function (socket) {
    // console.log(socket.id)


    socket.on('SEND_MESSAGE', function (data) {
        map.get(data.room).chat = [...map.get(data.room).chat, data];
        if (data.message.toLowerCase() == map.get(data.room).reponseImage.toLowerCase() && map.get(data.room).imageprogress < timeRound) {
            message = data.user + " a trouvé la reponse"
            io.sockets.in(data.room).emit('MESSAGE', { message: message });
            let index = map.get(data.room).personnes.findIndex(e => e.user == data.user);
            if (!data.dejaRepondu) {
                if (map.get(data.room).imageprogress < timeRound / 6) {
                    map.get(data.room).personnes[index].score += 100;
                }
                else if (map.get(data.room).imageprogress < timeRound / 3) {
                    map.get(data.room).personnes[index].score += 60;
                }
                else if (map.get(data.room).imageprogress < 5 * timeRound / 6) {
                    map.get(data.room).personnes[index].score += 40;
                }
                else {
                    map.get(data.room).personnes[index].score += 20;
                }
                map.get(data.room).personnes[index].dejaRepondu = true;
                io.sockets.in(data.room).emit('miseAJourRepondus', data);
            }

            io.emit('miseAJourScore', map.get(data.room).personnes);
            //si tout le monde a rep, on passe au suivantbqqq
            if (map.get(data.room).personnes.length == map.get(data.room).personnes.filter(e => e.dejaRepondu == true).length) {
                io.sockets.in(data.room).emit('toutLeMondeATrouve');
                map.get(data.room).imageprogress = timeRound;
            }
        }
        else {
            io.sockets.in(data.room).emit('MESSAGE', data);
        }
    });

    socket.on('connexionServeur', function (data) {
        if (!map.has(data.room)) {
            map.set(data.room, { personnes: [], chat: [], imageprogress: 0, imageselected: 0, reponseImage: "", gameStart: true, nbround: 1, categorie: "", });
            socket.join(data.room);
            data.host = true;
            map.get(data.room).personnes = [...map.get(data.room).personnes, data];
            io.emit('envoiSalonsCrees', getSalons());
            io.sockets.in(data.room).emit('accessAuthorized');
        } else if (map.get(data.room).personnes.some((e) => e.user == data.user)) {

            io.sockets.in(data.room).emit('accessDenied', data.user);
        }
        else {
            socket.join(data.room);
            map.get(data.room).personnes = [...map.get(data.room).personnes, data];
            io.sockets.in(data.room).emit('accessAuthorized');
        }
    });

    socket.on('envoiInfosServeur', function (data) {
        if (map.has(data.room)) {
            io.sockets.in(data.room).emit('miseAJourChat', map.get(data.room).chat);
            io.sockets.in(data.room).emit('miseAJourPersonnes', map.get(data.room).personnes);
        }
    });

    socket.on('deconnexionServeur', function (data) {
        const indexPersonne = map.get(data.room).personnes.findIndex(e => e.user == data.user);
        if (indexPersonne > -1) {
            map.get(data.room).personnes.splice(indexPersonne, 1);
        }
        //on supprime la room si il n'y a plus personne dedans
        if (map.get(data.room).personnes.length == 0) {
            clearInterval(map.get(data.room).interval);
            map.delete(data.room);

        }
    });

    socket.on('lancementChrono', function (data) {
        if (map.get(data.room).gameStart) {
            let imagesCategorie;
            map.get(data.room).categorie=data.categorie;
            if (map.get(data.room).categorie == "TOUTES") {
                imagesCategorie = data.images;
            } else {
                imagesCategorie = data.images.filter(e => e.categorie == map.get(data.room).categorie);
            }
            map.get(data.room).imageselected = Math.floor(Math.random() * imagesCategorie.length)
            map.get(data.room).imageselected = data.images.findIndex(e => e.image == imagesCategorie[map.get(data.room).imageselected].image);
            io.sockets.in(data.room).emit('partyBegin');
            let interval = chrono(data.room);
            map.get(data.room).interval = interval;
            map.get(data.room).gameStart = false;
        }
    });

    socket.on('reponseImage', function (data) {
        map.get(data.room).reponseImage = data.reponseImage
    });

    socket.on('newRound', function (data) {
        if (map.get(data.room).nbround < maxround) {
            let imagesCategorie;
            map.get(data.room).nbround++;
            map.get(data.room).imageprogress = 0;
            if ( map.get(data.room).categorie == "TOUTES") {
                imagesCategorie = data.images;
            } else {
                imagesCategorie = data.images.filter(e => e.categorie == map.get(data.room).categorie);
            }
            map.get(data.room).imageselected = Math.floor(Math.random() * imagesCategorie.length)
            map.get(data.room).imageselected = data.images.findIndex(e => e.image == imagesCategorie[map.get(data.room).imageselected].image);
            reponseImage = "";
            io.sockets.in(data.room).emit('RAZ');
            for (let i = 0; i < map.get(data.room).personnes.length; i++) {
                map.get(data.room).personnes[i].dejaRepondu = false;
            }
        } else {
            clearInterval(map.get(data.room).interval);
            map.get(data.room).gameStart = true;
            map.get(data.room).imageprogress = 0;
            map.get(data.room).nbround = 1;
            io.sockets.in(data.room).emit('partyFinish');
        }
    });

    socket.on("getSalonsCrees", function (data) {
        io.emit("envoiSalonsCrees", getSalons());
    });
});

function chrono(room) {
    let interval = setInterval(function () {
        map.get(room).imageprogress++;
        io.sockets.in(room).emit('pixeliserImage', {
            imageprogress: map.get(room).imageprogress,
            imageselected: map.get(room).imageselected
        }
        );
    }, 1000);
    return interval;
}

function getSalons() {
    let informationsSalons = [];
    map.forEach((values, keys) => {
        informationsSalons.push({ salon: keys, personnesParSalon: values.personnes.length });
    })
    return informationsSalons;
}
