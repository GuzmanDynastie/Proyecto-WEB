const router = require('express').Router();
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV1({
  version: '2024-03-14',
  authenticator: new IamAuthenticator({
    apikey: 'eNNfq1BKVrVdg7ic3BGHZfgEtQH49o_skkqekZemeSd1',
  }),
  serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/19a19308-1ba6-40b7-a066-bfedd697ef36',
  disableSslVerification: true,
});

// const params = {
//     input: { text: 'Hola' },
//     workspaceId: 'http://localhost:3000/', // Agrega aquí el ID de tu espacio de trabajo
// };

// assistant.message(params)
// .then(response => {
//     console.log(JSON.stringify(response.result, null, 2));
// })
// .catch(error => {
//     console.log(error);
// });

module.exports = router;