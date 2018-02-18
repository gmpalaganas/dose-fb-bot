'use strict'

const
    express = require('express'),
    body_parser = require('body-parser'),
    request = require('request'),
    app = express();


app.listen(process.env.PORT || 8888, () => console.log('webhook is listening ', app.get('port'));

app.use(body_parser.urlencoded({extended: false;}));
app.use(body_parser.json());

app.get('/', (req, res) => {
    res.send("Hello I'm Jemma");
});

app.post('/webhook', (req, res) => {

    let body = req.body;

    if(body.object == 'page'){

        body.entry.forEach(entry => {

            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

        });

        res.status(200).send('EVENT_RECEIVED');

    } else{

        res.sendStatus(404);
    }

});

app.get('/webhook', (req, res) => {

    const VERIFY_TOKEN = "RVhQTE9TMU9OISEh";

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if(mode && token){

        if(mode === 'subscribe' && token === VERIFY_TOKEN){

            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else{

            res.sendStatus(403);
        }
    }
});
