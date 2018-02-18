'use strict'

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

const
    express = require('express'),
    body_parser = require('body-parser'),
    request = require('request'),
    app = express();


app.listen(process.env.PORT || 8888, () => console.log('webhook is listening ', app.get('port')));

app.use(body_parser.urlencoded({extended: false}));
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

    let body = req.body;

    if(body.object === 'page'){

        body.entry.forEach( (entry) => {

            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender ID:' + sender_psid);

            if(webhook_event.message){
                handleMessage(sender_psid, webhook_event.message);
            }

        });

        res.status(200).send('EVENT_RECEIVED');
    
    } else{

        res.sendStatus(404);
    }

});


function handleMessage(sender_psid, message) {

    let response;

    if(message.text){
        response = {
            "text" : "You sent a message!"
        }
    }

    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response){

    let request_body = {

        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if(!err){
            console.log('message sent!');
        } else{
            console.error("Unable to send message:" + err);
        }
    });
}

    }

}
