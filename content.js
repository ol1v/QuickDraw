document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === '2') {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
  
      if (selectedText) {
        navigator.clipboard.writeText(selectedText).then(function() {
          console.log('Text copied to clipboard:', selectedText);
        }).catch(function(err) {
          console.error('Failed to copy text to clipboard:', err);
        });
      } else {
        console.log('No text selected.');
      }
    }
  
    if (event.key === '1') {
      navigator.clipboard.readText().then(function(text) {
        const selectedText = text.trim();
        if (selectedText) {
          chrome.storage.sync.get('sites', function(data) {
            const sites = data.sites || [];
            sites.forEach(site => {
              const newTabUrl = site.url.replace('<ip-to-lookup>', encodeURIComponent(selectedText));
              chrome.runtime.sendMessage({ action: "createNewTab", text: newTabUrl });
            });
          });
        } else {
          console.log('Clipboard is empty.');
        }
      }).catch(function(err) {
        console.error('Failed to read from clipboard:', err);
      });
    }
  });
  