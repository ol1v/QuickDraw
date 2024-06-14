document.addEventListener('DOMContentLoaded', function() {
    const sitesList = document.getElementById('sitesList');
  
    function loadSites() {
      chrome.storage.sync.get('sites', function(data) {
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
  