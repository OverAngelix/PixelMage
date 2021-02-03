const express = require('express');
const app = express();
const maxround = 10;
const timeRound = 60;

var map = new Map();


const server = app.listen(3001, function () {
    console.log('server running on port 3001');
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
            console.log("ICI1");
            map.set(data.room, { personnes: [], chat: [], imageprogress: 1, imageselected: 0, reponseImage: "", gameStart: true, nbround: 0, categorie: "Célébrités" });
            console.log(map.get(data.room))
            socket.join(data.room);
            map.get(data.room).personnes = [...map.get(data.room).personnes, data];
        } else if (map.get(data.room).personnes.some((e) => e.user == data.user)) {
            console.log("ICI2");
            io.sockets.in(data.room).emit('accessDenied', data.user);
        }
        else {
            socket.join(data.room);
            console.log("ICI3");
            map.get(data.room).personnes = [...map.get(data.room).personnes, data];
        }
        console.log(map.get(data.room).personnes);
        io.sockets.in(data.room).emit('accessAuthorized');
    });

    socket.on('envoiInfosServeur', function (data) {
        io.sockets.in(data.room).emit('miseAJourChat', map.get(data.room).chat);
        io.sockets.in(data.room).emit('miseAJourPersonnes', map.get(data.room).personnes);
    });

    socket.on('deconnexionServeur', function (data) {
        const indexPersonne = map.get(data.room).personnes.findIndex(e => e.user == data.user);
        if (indexPersonne > -1) {
            map.get(data.room).personnes.splice(indexPersonne, 1);
        }
    });

    socket.on('lancementChrono', function (data) {
        console.log(data.room);
        if (map.get(data.room).gameStart) {
            let imagesCategorie = data.images.filter(e => e.categorie == map.get(data.room).categorie);
            map.get(data.room).imageselected = Math.floor(Math.random() * imagesCategorie.length)
            map.get(data.room).imageselected = data.images.findIndex(e => e.image == imagesCategorie[map.get(data.room).imageselected].image);
            chrono(data.room);
            map.get(data.room).gameStart = false;
        }
    });

    socket.on('reponseImage', function (data) {
        map.get(data.room).reponseImage = data.reponseImage
    });

    socket.on('newRound', function (data) {
        if (map.get(data.room).nbround < maxround) {
            map.get(data.room).nbround++;
            map.get(data.room).imageprogress = 0;
            let imagesCategorie = data.images.filter(e => e.categorie == map.get(data.room).categorie);
            map.get(data.room).imageselected = Math.floor(Math.random() * imagesCategorie.length)
            map.get(data.room).imageselected = data.images.findIndex(e => e.image == imagesCategorie[map.get(data.room).imageselected].image);
            reponseImage = "";
            io.sockets.in(data.room).emit('RAZ');
            for (let i = 0; i < map.get(data.room).personnes.length; i++) {
                map.get(data.room).personnes[i].dejaRepondu = false;
            }
        }
    });
});

function chrono(room) {
    setInterval(function () {
        map.get(room).imageprogress++;
        io.sockets.in(room).emit('pixeliserImage', {
            imageprogress: map.get(room).imageprogress,
            imageselected: map.get(room).imageselected
        }
        );
        /*         io.sockets.in("1234").emit('messageRoom', 'what is going on, party people?');
                io.sockets.in('4321').emit('messageRoom', 'anyone in this room yet?'); */
    }, 1000);
}

