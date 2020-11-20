'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  } else {
    // console.log(received_message.attachments[0]);
    // const attachment_url = received_message.attachments[0].payload.url;
    response = {
      "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Talk to an agent",
                    "payload": "CARE_HELP"
                },
                {
                    "type": "postback",
                    "title": "Outfit suggestions",
                    "payload": "CURATION"
                },
                {
                    "type": "web_url",
                    "title": "Shop now",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "full"
                }
            ]
        }
    ]
    }
  }
  
  console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeee", response)
  callSendAPI(sender_psid, response);  

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
async function callSendAPI(sender_psid, response) {
  try {

    // Construct the message body
    const request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    };
    
    const url = "https://graph.facebook.com/v2.6/me/messages";
    
    const params = {
      "access_token": process.env.PAGE_ACCESS_TOKEN
    }
    
    const axiosResponse = await axios.post(url, request_body, { params })
    
    
    // const test = await request({
      //   "uri": "https://graph.facebook.com/v2.6/me/messages",
      //   "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
      //   "method": "POST",
      //   "json": request_body
      // }, (err, res, body) => {
        //   if (!err) {
          //     console.log('message sent!')
          //   } else {
            //     console.error("Unable to send message:" + err);
            //   }
            // }); 
            console.log("testando retorno api do facebook", axiosResponse.data, axiosResponse.status, axiosResponse.statusText)
          } catch (err) {
            console.log("deu esse erro", err.status, err.statusText, err)
          }
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
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`webhook is listening on port ${port}`));