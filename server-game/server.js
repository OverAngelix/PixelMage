const express = require('express');
let globalchat = [];
let listePersonne = [];
const app = express();
let imageprogress = 1;
let imageselected = 0;
let reponseImage = "";
let gameStart = true;



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
        io.emit('MESSAGE', data);
        if (data.message.toLowerCase() == reponseImage.toLowerCase()) {
            message = data.user + " a trouvé la reponse"
            io.emit('MESSAGE', { message: message });
        }
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

