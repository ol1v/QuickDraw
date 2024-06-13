document.addEventListener('keydown', function(event) {
    // Check if the pressed key is "1"
    if (event.key === '1') {
        // Read text from the clipboard
        navigator.clipboard.readText()
            .then(text => {
                if (text.trim() !== '') {
                    console.log('Text read from clipboard:', text);
                    // Signal the background script to open a new tab with the clipboard text
                    chrome.runtime.sendMessage({ action: "openNewTab", text: text.trim() }, function(response) {
                        if (response && response.status === 'success') {
                            console.log('New tab opened successfully. Tab ID:', response.tabId);
                        } else {
                            console.error('Failed to open new tab:', response ? response.message : 'Unknown error');
                        }
                    });
                } else {
                    console.log('Clipboard is empty or does not contain text.');
                }
            })
            .catch(err => {
                console.error('Failed to read text from clipboard:', err);
            });
    }
});
