'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

app.get('/', (req, res) => {
  console.log("testandoooo");
  res.send("testandoooooooo")
})

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
      const webhook_event = entry.messaging[0].message;
      console.log("menssage recebi dentro de entrys\n", webhook_event);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`webhook is listening on port ${port}`));