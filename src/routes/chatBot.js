const express = require('express');
const router = express.Router();
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const assistant = new AssistantV1({
  version: '2024-03-14',
  authenticator: new IamAuthenticator({
    apikey: 'eNNfq1BKVrVdg7ic3BGHZfgEtQH49o_skkqekZemeSd1',
  }),
  serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/19a19308-1ba6-40b7-a066-bfedd697ef36',
  disableSslVerification: true,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

let sessionID; // Variable para almacenar el ID de sesión

wss.on('connection', (ws) => {
  console.log('Cliente conectado.');

  // Iniciar una nueva sesión cuando un cliente se conecta
  assistant.createSession({ assistantId: 'f77c8f1c-cd9b-4453-b62f-365de65708c9' })
    .then(response => {
      sessionID = response.result.session_id;
      console.log('Sesión iniciada. ID de sesión:', sessionID);
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
    });

  // Escuchar mensajes del cliente
  ws.on('message', (message) => {
    console.log('Mensaje recibido del cliente:', message);

    // Enviar el mensaje del cliente al asistente de Watson
    assistant.message({
      assistantId: 'f77c8f1c-cd9b-4453-b62f-365de65708c9',
      sessionId: sessionID,
      input: { text: message }
    })
      .then(response => {
        // Imprimir la respuesta del asistente de Watson en la consola
        console.log('Respuesta del asistente de Watson:', response.result.output.generic[0].text);
      })
      .catch(error => {
        console.error('Error al enviar mensaje al asistente:', error);
      });
  });
});

module.exports = router;