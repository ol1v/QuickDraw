chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "createNewTab") {
        const newTabUrl = message.text;
        console.log('Opening new tab with URL:', newTabUrl);

        chrome.tabs.create({ url: newTabUrl }, function(tab) {
            console.log('New tab created:', tab);
            sendResponse({ status: 'success', tabId: tab.id });
        });
        return true; // Required for async sendResponse
    } else {
        console.log('Received unknown message:', message);
        sendResponse({ status: 'error', message: 'Unknown action' });
    }
});
