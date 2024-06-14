console.log('Content script loaded.');

document.addEventListener('keydown', function(event) {
  console.log('Keydown event detected:', event.key);

  chrome.storage.sync.get(['hotkeyBindings', 'sites'], function(result) {
    const hotkeyBindings = result.hotkeyBindings || [];
    const sitesData = result.sites || [];
    console.log('Hotkey configurations:', hotkeyBindings);
    console.log('Sites data:', sitesData);

    hotkeyBindings.forEach(binding => {
      const hotkeyCombination = binding.hotkey || [];
      const sites = binding.sites || [];
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

      // Check if the pressed keys match the stored hotkey combination exactly
      const isMatch = hotkeyCombination.length === pressedKeys.length && hotkeyCombination.every(key => pressedKeys.includes(key));
      console.log('Is hotkey combination match:', isMatch);

      if (isMatch) {
        console.log('Hotkey combination matched. Reading from clipboard...');
        navigator.clipboard.readText().then(function(text) {
          const selectedText = text.trim();
          console.log('Clipboard content:', selectedText);

          if (selectedText) {
            sites.forEach(siteName => {
              const site = sitesData.find(s => s.name === siteName);
              if (site) {
                const newTabUrl = site.url.replace('<ip-to-lookup>', encodeURIComponent(selectedText));
                console.log('New tab URL:', newTabUrl);
                chrome.runtime.sendMessage({ action: "createNewTab", text: newTabUrl });
              } else {
                console.log(`Site configuration for ${siteName} not found.`);
              }
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
});
