document.addEventListener('DOMContentLoaded', function() {
    const siteNameInput = document.getElementById('siteName');
    const siteUrlInput = document.getElementById('siteUrl');
    const addSiteButton = document.getElementById('addSiteButton');
    const sitesList = document.getElementById('sitesList');
  
    function loadSites() {
      chrome.storage.sync.get('sites', function(data) {
        const sites = data.sites || [];
        sitesList.innerHTML = '';
        sites.forEach((site, index) => {
          const li = document.createElement('li');
          li.textContent = `${site.name}: ${site.url}`;
          sitesList.appendChild(li);
        });
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
            loadSites();
            siteNameInput.value = '';
            siteUrlInput.value = '';
          });
        });
      }
    }
  
    addSiteButton.addEventListener('click', addSite);
    loadSites();
  });
  