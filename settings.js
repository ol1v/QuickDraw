document.addEventListener('DOMContentLoaded', function() {
    const hotkeyInput = document.getElementById('hotkeyInput');
    const saveButton = document.getElementById('saveButton');
    let hotkeyCombination = [];
  
    // Load the stored hotkey from storage
    chrome.storage.sync.get(['hotkey', 'sites'], function(result) {
      if (result.hotkey) {
        hotkeyCombination = result.hotkey;
        hotkeyInput.value = hotkeyCombination.join(' + ');
        console.log('Loaded hotkey combination from storage:', hotkeyCombination);
      }
    });
  
    // Detect the hotkey combination
    hotkeyInput.addEventListener('keydown', function(event) {
      event.preventDefault(); // Prevent the default action to avoid unintended behavior
      const key = event.key;
      if (!hotkeyCombination.includes(key)) {
        hotkeyCombination.push(key);
        hotkeyInput.value = hotkeyCombination.join(' + ');
        console.log('Hotkey combination updated:', hotkeyCombination);
      }
    });
  
    // Clear the hotkey combination when the input field is focused
    hotkeyInput.addEventListener('focus', function() {
      hotkeyCombination = [];
      hotkeyInput.value = '';
      console.log('Hotkey input field focused. Hotkey combination reset.');
    });
  
    // Save the selected hotkey combination to storage
    saveButton.addEventListener('click', function() {
      chrome.storage.sync.set({ hotkey: hotkeyCombination }, function() {
        alert('Hotkey saved: ' + hotkeyCombination.join(' + '));
        console.log('Hotkey combination saved to storage:', hotkeyCombination);
      });
    });
  });
  