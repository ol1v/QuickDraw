document.addEventListener('DOMContentLoaded', function() {
    const siteNameInput = document.getElementById('siteName');
    const siteIpUrlInput = document.getElementById('siteIpUrl');
    const siteDomainUrlInput = document.getElementById('siteDomainUrl');
    const siteHashUrlInput = document.getElementById('siteHashUrl');
    const addSiteButton = document.getElementById('addSiteButton');
    const sitesList = document.getElementById('sitesList');
  
    const hotkeyInput = document.getElementById('hotkeyInput');
    const saveButton = document.getElementById('saveButton');
    const siteCheckboxes = document.getElementById('siteCheckboxes');
    const hotkeysList = document.getElementById('hotkeysList');
    let hotkeyCombination = [];
    let selectedSites = [];
  
    // Load stored sites and hotkeys from storage
    chrome.storage.sync.get(['sites', 'hotkeyBindings'], function(result) {
      const sites = result.sites || [];
      const hotkeyBindings = result.hotkeyBindings || [];
      loadSites(sites);
      loadHotkeyBindings(hotkeyBindings);
    });
  
    // Load sites into the list and checkboxes
    function loadSites(sites) {
      sitesList.innerHTML = '';
      siteCheckboxes.innerHTML = '';
      sites.forEach((site, index) => {
        const li = document.createElement('li');
        li.textContent = `${site.name}`;
        sitesList.appendChild(li);
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `site-${index}`;
        checkbox.value = site.name;
        siteCheckboxes.appendChild(checkbox);
        const label = document.createElement('label');
        label.htmlFor = `site-${index}`;
        label.textContent = site.name;
        siteCheckboxes.appendChild(label);
        siteCheckboxes.appendChild(document.createElement('br'));
      });
    }
  
    function loadHotkeyBindings(hotkeyBindings) {
      hotkeysList.innerHTML = '';
      hotkeyBindings.forEach((binding, index) => {
        const { hotkey, sites } = binding;
        const li = document.createElement('li');
        li.className = 'hotkey-item';
        li.innerHTML = `
          ${hotkey.join(' + ')}: ${sites.join(', ')}
          <button class="editButton" data-index="${index}">Edit</button>
          <button class="removeButton" data-index="${index}">Remove</button>
        `;
        hotkeysList.appendChild(li);
      });
      attachHotkeyButtonsListeners();
    }
  
    function attachHotkeyButtonsListeners() {
      document.querySelectorAll('.editButton').forEach(button => {
        button.addEventListener('click', function() {
          const index = this.getAttribute('data-index');
          editHotkeyConfiguration(index);
        });
      });
  
      document.querySelectorAll('.removeButton').forEach(button => {
        button.addEventListener('click', function() {
          const index = this.getAttribute('data-index');
          removeHotkeyConfiguration(index);
        });
      });
    }
  
    function addSite() {
      const name = siteNameInput.value.trim();
      const ipUrl = siteIpUrlInput.value.trim();
      const domainUrl = siteDomainUrlInput.value.trim();
      const hashUrl = siteHashUrlInput.value.trim();
      
      if (name && (ipUrl || domainUrl || hashUrl)) {
        chrome.storage.sync.get('sites', function(data) {
          const sites = data.sites || [];
          sites.push({
            name,
            urls: {
              ip: ipUrl,
              domain: domainUrl,
              hash: hashUrl
            }
          });
          chrome.storage.sync.set({ sites }, function() {
            loadSites(sites);
            siteNameInput.value = '';
            siteIpUrlInput.value = '';
            siteDomainUrlInput.value = '';
            siteHashUrlInput.value = '';
          });
        });
      }
    }
  
    hotkeyInput.addEventListener('keydown', function(event) {
      event.preventDefault(); // Prevent the default action to avoid unintended behavior
      const key = event.key;
      if (!hotkeyCombination.includes(key)) {
        hotkeyCombination.push(key);
        hotkeyInput.value = hotkeyCombination.join(' + ');
        console.log('Hotkey combination updated:', hotkeyCombination);
      }
    });
  
    hotkeyInput.addEventListener('focus', function() {
      hotkeyCombination = [];
      hotkeyInput.value = '';
      console.log('Hotkey input field focused. Hotkey combination reset.');
    });
  
    saveButton.addEventListener('click', function() {
      selectedSites = [];
      const checkboxes = document.querySelectorAll('#siteCheckboxes input[type="checkbox"]:checked');
      checkboxes.forEach(checkbox => selectedSites.push(checkbox.value));
  
      chrome.storage.sync.get('hotkeyBindings', function(data) {
        const hotkeyBindings = data.hotkeyBindings || [];
        hotkeyBindings.push({
          hotkey: hotkeyCombination,
          sites: selectedSites
        });
  
        chrome.storage.sync.set({ hotkeyBindings }, function() {
          alert('Hotkey and site bindings saved.');
          console.log('Hotkey and site bindings saved to storage:', hotkeyBindings);
          loadHotkeyBindings(hotkeyBindings);
        });
      });
    });
  
    function editHotkeyConfiguration(index) {
      chrome.storage.sync.get('hotkeyBindings', function(data) {
        const hotkeyBindings = data.hotkeyBindings || [];
        const binding = hotkeyBindings[index];
        hotkeyCombination = binding.hotkey;
        selectedSites = binding.sites;
  
        hotkeyInput.value = hotkeyCombination.join(' + ');
        const checkboxes = document.querySelectorAll('#siteCheckboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = selectedSites.includes(checkbox.value);
        });
  
        // Remove the old configuration before saving the new one
        hotkeyBindings.splice(index, 1);
        chrome.storage.sync.set({ hotkeyBindings }, function() {
          console.log('Ready to edit hotkey configuration:', hotkeyCombination, selectedSites);
        });
      });
    }
  
    function removeHotkeyConfiguration(index) {
      chrome.storage.sync.get('hotkeyBindings', function(data) {
        const hotkeyBindings = data.hotkeyBindings || [];
        hotkeyBindings.splice(index, 1);
        chrome.storage.sync.set({ hotkeyBindings }, function() {
          console.log('Hotkey configuration removed:', index);
          loadHotkeyBindings(hotkeyBindings);
        });
      });
    }
  
    addSiteButton.addEventListener('click', addSite);
  });
  