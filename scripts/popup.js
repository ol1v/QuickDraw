document.addEventListener('DOMContentLoaded', () => {
    const sitesList = document.getElementById('sitesList');
  // load configured sites from chrome storage to display in popup
    const loadSites = () => {
      chrome.storage.sync.get('sites', (data) => {
        const sites = data.sites || [];
        sitesList.innerHTML = '';
        sites.forEach((site) => {
          const li = document.createElement('li');
          li.textContent = site.name;
          sitesList.appendChild(li);
        });
      });
    }
  
    loadSites();
  });
  