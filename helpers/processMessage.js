const API_AI_TOKEN = '393a9f2270334a0da8d17c43440c5643';
const FACEBOOK_ACCESS_TOKEN = 'EAAKqj89OOxMBAE7RVPJPrPHad8avN1p2cVtOwITKoVPmcxIAdBwbDyrNUk0uQv9lZBL51LMMbqqiD0PZAWHP82mZANGYemQZAzEr3ZAPfanrnc3v4Rbc8pmmj2zUJErIKPsn9KZBVaNgDYUjwbhJnhxkSUXKnMFsCxkfmMddu7ZAwZDZD';

const request = require('request');

const apiAiClient = require('apiai')(API_AI_TOKEN);

const sendImage = (senderId, imageUri) => {
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                attachment: {
                    type: 'image',
                    payload: { url: imageUri }
                }
            }
        }
    });
};

const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'botcube_co'});

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;

        if (response.result.metadata.intentName === 'images.search') {
            sendImage(senderId, result);
        } else {
            sendTextMessage(senderId, result);
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
