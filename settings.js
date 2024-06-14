document.addEventListener('DOMContentLoaded', function() {
    const siteNameInput = document.getElementById('siteName');
    const siteUrlInput = document.getElementById('siteUrl');
    const addSiteButton = document.getElementById('addSiteButton');
    const sitesList = document.getElementById('sitesList');
    const hotkeyConfigs = document.getElementById('hotkeyConfigs');
    const addHotkeyConfigButton = document.getElementById('addHotkeyConfigButton');
  
    let sites = [];
    let hotkeyBindings = [];
  
    function loadSites() {
      chrome.storage.sync.get('sites', function(data) {
        sites = data.sites || [];
        renderSites();
      });
    }
  
    function renderSites() {
      sitesList.innerHTML = '';
      sites.forEach((site, index) => {
        const li = document.createElement('li');
        li.textContent = `${site.name}: ${site.url}`;
        sitesList.appendChild(li);
      });
    }
  
    function addSite() {
      const name = siteNameInput.value.trim();
      const url = siteUrlInput.value.trim();
      
      if (name && url) {
        sites.push({ name, url });
        chrome.storage.sync.set({ sites }, function() {
          renderSites();
          siteNameInput.value = '';
          siteUrlInput.value = '';
        });
      }
    }
  
    function loadHotkeyBindings() {
      chrome.storage.sync.get('hotkeyBindings', function(data) {
        hotkeyBindings = data.hotkeyBindings || [];
        console.log('Loaded hotkey bindings:', hotkeyBindings); // Added logging
        renderHotkeyBindings();
      });
    }
  
    function renderHotkeyBindings() {
      hotkeyConfigs.innerHTML = '';
      hotkeyBindings.forEach((binding, index) => {
        const div = document.createElement('div');
        div.className = 'hotkey-config';
        
        const hotkeyLabel = document.createElement('label');
        hotkeyLabel.textContent = `Hotkey Combination ${index + 1}:`;
        div.appendChild(hotkeyLabel);
        
        const hotkeyInput = document.createElement('input');
        hotkeyInput.type = 'text';
        hotkeyInput.value = binding.hotkey.join(' + ');
        div.appendChild(hotkeyInput);
        
        const siteCheckboxes = document.createElement('div');
        sites.forEach(site => {
          const checkboxLabel = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = site.name;
          checkbox.checked = binding.sites.includes(site.name);
          
          checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
              binding.sites.push(site.name);
            } else {
              binding.sites = binding.sites.filter(s => s !== site.name);
            }
            chrome.storage.sync.set({ hotkeyBindings }, function() {
              console.log('Hotkey bindings updated:', hotkeyBindings); // Added logging
            });
          });
  
          checkboxLabel.appendChild(checkbox);
          checkboxLabel.appendChild(document.createTextNode(site.name));
          siteCheckboxes.appendChild(checkboxLabel);
        });
        div.appendChild(siteCheckboxes);
  
        hotkeyInput.addEventListener('keydown', function(event) {
          event.preventDefault(); // Prevent the default action to avoid unintended behavior
          const key = event.key;
          if (!binding.hotkey.includes(key)) {
            binding.hotkey.push(key);
            hotkeyInput.value = binding.hotkey.join(' + ');
            chrome.storage.sync.set({ hotkeyBindings }, function() {
              console.log('Hotkey bindings saved:', hotkeyBindings); // Added logging
            });
          }
        });
  
        hotkeyInput.addEventListener('focus', function() {
          binding.hotkey = [];
          hotkeyInput.value = '';
        });
  
        hotkeyConfigs.appendChild(div);
      });
    }
  
    function addHotkeyConfig() {
      hotkeyBindings.push({ hotkey: [], sites: [] });
      renderHotkeyBindings();
    }
  
    addSiteButton.addEventListener('click', addSite);
    addHotkeyConfigButton.addEventListener('click', addHotkeyConfig);
  
    loadSites();
    loadHotkeyBindings();
  });
