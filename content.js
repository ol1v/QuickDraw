console.log('Content script loaded.');

document.addEventListener('keydown', function(event) {
  console.log('Keydown event detected:', event.key);

  chrome.storage.sync.get(['hotkey', 'sites'], function(result) {
    const hotkeyCombination = result.hotkey || ['Control', '1']; // Default to CTRL+1 if no hotkey is set
    const sites = result.sites || [];
    const pressedKeys = [event.key];

    console.log('Stored hotkey combination:', hotkeyCombination);
    console.log('Sites:', sites);

    if (event.ctrlKey || event.metaKey) {
      pressedKeys.push('Control');
    }
    if (event.shiftKey) {
      pressedKeys.push('Shift');
    }
    if (event.altKey) {
      pressedKeys.push('Alt');
    }

    console.log('Pressed keys:', pressedKeys);

    // Check if the pressed keys match the stored hotkey combination
    const isMatch = hotkeyCombination.every(key => pressedKeys.includes(key));
    console.log('Is hotkey combination match:', isMatch);

    if (isMatch) {
      console.log('Hotkey combination matched. Reading from clipboard...');
      navigator.clipboard.readText().then(function(text) {
        const selectedText = text.trim();
        console.log('Clipboard content:', selectedText);

        if (selectedText) {
          sites.forEach(site => {
            const newTabUrl = site.url.replace('<ip-to-lookup>', encodeURIComponent(selectedText));
            console.log('New tab URL:', newTabUrl);
            chrome.runtime.sendMessage({ action: "createNewTab", text: newTabUrl });
          });
        } else {
          console.log('Clipboard is empty.');
        }
      }).catch(function(err) {
        console.error('Failed to read from clipboard:', err);
      });
    }
  });
});
