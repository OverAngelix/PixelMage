const express = require('express');
let globalchat = [];
let listePersonne = [];
const app = express();
let imageprogress = 1;
let imageselected = 0;
let reponseImage = "";
let gameStart = true;
let nbround = 0;
const maxround = 10;
const timeRound = 60;
let categorie="Célébrités";


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
        if (data.message.toLowerCase() == reponseImage.toLowerCase() && imageprogress<timeRound) {
            message = data.user + " a trouvé la reponse"
            io.emit('MESSAGE', { message: message });
            let index = listePersonne.findIndex(e => e.user == data.user);
            if (!data.dejaRepondu) {
                if (imageprogress<timeRound/6){
                    listePersonne[index].score+=100;
                }
                else if (imageprogress<timeRound/3){
                    listePersonne[index].score+=60;
                }
                else if (imageprogress<5*timeRound/6){
                    listePersonne[index].score+=40;
                }
                else{
                    listePersonne[index].score+=20;
                }
                listePersonne[index].dejaRepondu=true;
                io.emit('miseAJourRepondus', data);
            }

            io.emit('miseAJourScore', listePersonne);
            //si tout le monde a rep, on passe au suivant
            console.log(listePersonne.length);
            console.log(listePersonne.filter(e=>e.dejaRepondu==true).length);
             if(listePersonne.length==listePersonne.filter(e=>e.dejaRepondu==true).length){
                console.log("tout le monde a trouvé");
                io.emit('toutLeMondeATrouve');
                imageprogress=timeRound;
            } 
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
            let imagesCategorie=data.images.filter(e => e.categorie == categorie);
            imageselected = Math.floor(Math.random() * imagesCategorie.length)
            imageselected = data.images.findIndex(e => e.image==imagesCategorie[imageselected].image);
            chrono();
            gameStart = false;
        }
    });

    socket.on('reponseImage', function (data) {
        reponseImage = data.reponseImage
    });

    socket.on('newRound', function (data) {
        if (nbround < maxround) {
            nbround++;
            imageprogress = 0;
            let imagesCategorie=data.images.filter(e => e.categorie == categorie);
            imageselected = Math.floor(Math.random() * imagesCategorie.length)
            imageselected = data.images.findIndex(e => e.image==imagesCategorie[imageselected].image);
            //imageselected = Math.floor(Math.random() * data.images.length)
            reponseImage = "";
            io.emit('RAZ');
            for (let i=0;i<listePersonne.length;i++){
                listePersonne[i].dejaRepondu=false;
            }
            console.log(listePersonne);
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

