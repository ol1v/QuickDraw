chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('Extension installed for the first time.');
      fetch(chrome.runtime.getURL('data/predefined_sites.json'))
        .then(response => response.json())
        .then(predefinedSites => {
          // Get current sites from storage
          chrome.storage.sync.get('sites', function(data) {
            const sites = data.sites || [];
            
            // Add predefined sites to the current sites
            predefinedSites.forEach(site => {
              sites.push({
                name: site.name,
                urls: {
                  ip: site.urls.ip,
                  domain: site.urls.domain,
                  hash: site.urls.hash
                }
              });
            });
  
            // Save updated sites to storage
            chrome.storage.sync.set({ sites }, function() {
              console.log('Predefined sites added.');
            });
          });
        })
        .catch(error => {
          console.error('Error loading predefined sites:', error);
        });
    }
  });  
  
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
