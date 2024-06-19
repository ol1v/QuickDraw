console.log('Content script loaded.');

document.addEventListener('keydown', (event) => {
  console.log('Keydown event detected:', event.key);

  chrome.storage.sync.get(['hotkeyBindings', 'sites'], (result) => {
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
        navigator.clipboard.readText().then((text) => {
          const selectedText = text.trim();
          console.log('Clipboard content:', selectedText);

          if (selectedText) {
            sites.forEach(siteName => {
              const site = sitesData.find(s => s.name === siteName);
              if (site) {
                let newTabUrl;
                if (selectedText.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                  newTabUrl = site.urls.ip.replace('<ioc-type>', encodeURIComponent(selectedText));
                } else if (selectedText.match(/^[a-f0-9]{32}|[a-f0-9]{40}|[a-f0-9]{64}$/)) {
                  newTabUrl = site.urls.hash.replace('<ioc-type>', encodeURIComponent(selectedText));
                } else if (selectedText.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                  newTabUrl = site.urls.domain.replace('<ioc-type>', encodeURIComponent(selectedText));
                } else {
                  console.log('Unsupported IoC format.');
                  return;
                }
                console.log('New tab URL:', newTabUrl);
                chrome.runtime.sendMessage({ action: "createNewTab", text: newTabUrl });
              } else {
                console.log(`Site configuration for ${siteName} not found.`);
              }
            });
          } else {
            console.log('Clipboard is empty.');
          }
        }).catch((err) => {
          console.error('Failed to read from clipboard:', err);
        });
      }
    });
  });
});
