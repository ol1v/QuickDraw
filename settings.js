document.addEventListener('DOMContentLoaded', function() {
    const siteNameInput = document.getElementById('siteName');
    const siteUrlInput = document.getElementById('siteUrl');
    const addSiteButton = document.getElementById('addSiteButton');
    const sitesList = document.getElementById('sitesList');
  
    const hotkeyInput = document.getElementById('hotkeyInput');
    const saveButton = document.getElementById('saveButton');
    let hotkeyCombination = [];
  
    // Load the stored hotkey and sites from storage
    chrome.storage.sync.get(['hotkey', 'sites'], function(result) {
      if (result.hotkey) {
        hotkeyCombination = result.hotkey;
        hotkeyInput.value = hotkeyCombination.join(' + ');
        console.log('Loaded hotkey combination from storage:', hotkeyCombination);
      }
      const sites = result.sites || [];
      loadSites(sites);
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
  
    function loadSites(sites) {
      sitesList.innerHTML = '';
      sites.forEach((site, index) => {
        const li = document.createElement('li');
        li.textContent = `${site.name}: ${site.url}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.addEventListener('click', function() {
          removeSite(index);
        });
        li.appendChild(removeButton);
        sitesList.appendChild(li);
      });
    }
  
    function addSite() {
      const name = siteNameInput.value.trim();
      const url = siteUrlInput.value.trim();
  
      if (name && url) {
        chrome.storage.sync.get('sites', function(data) {
          const sites = data.sites || [];
          sites.push({ name, url });
          chrome.storage.sync.set({ sites }, function() {
            loadSites(sites);
            siteNameInput.value = '';
            siteUrlInput.value = '';
          });
        });
      }
    }
  
    function removeSite(index) {
      chrome.storage.sync.get('sites', function(data) {
        const sites = data.sites || [];
        sites.splice(index, 1);
        chrome.storage.sync.set({ sites }, function() {
          loadSites(sites);
        });
      });
    }
  
    addSiteButton.addEventListener('click', addSite);
  });
  