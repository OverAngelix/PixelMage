const express = require('express');
let globalchat = [];
let listePersonne = [];
const app = express();
let imageprogress = 1;
let imageselected = 0;



const server = app.listen(3001, function () {
    console.log('server running on port 3001');
});


const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', function (socket) {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function (data) {
        globalchat = [...globalchat, data];
        io.emit('MESSAGE', data);
    });

    socket.on('connexionServeur', function (data) {
        listePersonne = [...listePersonne, data];
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
        if (imageprogress <= 1) {
            imageselected = Math.floor(Math.random() * data.imagessize)
            chrono();
        }
    });
    // 
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

