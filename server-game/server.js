const express = require('express');
let globalchat = [];
let listePersonne = [];
const app = express();
let imageprogress = 1;
let imageselected = 0;
let reponseImage = "";
let gameStart = true;
let nbround = 0;
let maxround = 10;



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
        globalchat = [...globalchat, data];
        if (data.message.toLowerCase() == reponseImage.toLowerCase()) {
            message = data.user + " a trouvé la reponse"
            io.emit('MESSAGE', { message: message });
            let index = listePersonne.findIndex(e => e.user == data.user);
            if (!data.dejaRepondu) {
                listePersonne[index].score++;
                io.emit('miseAJourRepondus', data);
            }

            io.emit('miseAJourScore', listePersonne);
        }
        else {
            io.emit('MESSAGE', data);
        }
    });

    socket.on('connexionServeur', function (data) {
        if (listePersonne.some((e) => e.user == data.user)) {
            io.emit('accessDenied', data.user);
        }
        else {
            listePersonne = [...listePersonne, data];
            io.emit('accessAuthorized');
        }

    });

    socket.on('envoiInfosServeur', function () {
        io.emit('miseAJourChat', globalchat);
        io.emit('miseAJourPersonnes', listePersonne);
    });

    socket.on('deconnexionServeur', function (data) {
        const indexPersonne = listePersonne.findIndex(e => e.user == data.user);
        if (indexPersonne > -1) {
            listePersonne.splice(indexPersonne, 1);
        }
    });

    socket.on('lancementChrono', function (data) {
        if (gameStart) {
            imageselected = Math.floor(Math.random() * data.imagessize)
            chrono();
        }
    });

    socket.on('reponseImage', function (data) {
        if (gameStart) {
            reponseImage = data.reponseImage
            gameStart = false;
        }
    });

    socket.on('newRound', function (data) {
        if (nbround < maxround) {
            nbround++;
            imageprogress = 0;
            imageselected = Math.floor(Math.random() * data.imagessize)
            reponseImage = "";
        }
    });
});

function chrono() {
    setInterval(function () {
        imageprogress++;
        io.emit('pixeliserImage', {
            imageprogress: imageprogress,
            imageselected: imageselected
        }
        );
    }, 1000);
}

