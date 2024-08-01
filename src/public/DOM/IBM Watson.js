window.watsonAssistantChatOptions = {
    integrationID: "34f701c0-4660-4e0c-9f32-6a64a53d636e", // The ID of this integration.
    region: "us-east", // The region your integration is hosted in.
    serviceInstanceID: "263fe49e-992e-498b-905f-da785c8c6ae2", // The ID of your service instance.
    onLoad: async (instance) => { await instance.render(); }
};

setTimeout(function () {
    const t = document.createElement('script');
    t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
});
