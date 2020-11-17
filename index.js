'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
console.log("tokeeeen", PAGE_ACCESS_TOKEN)

function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>";

  console.log("vendo o que vem dentro de query\n", req.query);

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
})

app.post('/webhook', (req, res) => {
  const body = req.body;
  console.log("vendo o que tem dentro do body\n", body);

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhook_event = entry.messaging[0];
      const sender_psid = webhook_event.sender.id;
      console.log("menssage recebi dentro de entrys\n", webhook_event);
      console.log("sender PSID", sender_psid);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`webhook is listening on port ${port}`));