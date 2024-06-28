document.addEventListener('DOMContentLoaded', () => {
  const siteNameInput = document.getElementById('siteName')
  const siteIpUrlInput = document.getElementById('siteIpUrl')
  const siteDomainUrlInput = document.getElementById('siteDomainUrl')
  const siteHashUrlInput = document.getElementById('siteHashUrl')
  const addSiteButton = document.getElementById('addSiteButton')
  const sitesList = document.getElementById('sitesList')
  const hotkeyInput = document.getElementById('hotkeyInput')
  const saveButton = document.getElementById('saveButton')
  const siteCheckboxes = document.getElementById('siteCheckboxes')
  const hotkeysList = document.getElementById('hotkeysList')
  const toggleAddNewSiteButton = document.getElementById('toggleAddNewSite')
  const addSiteDiv = document.getElementById('addSiteDiv')
  const toggleAddNewHotkeyButton = document.getElementById('toggleAddNewHotkeyButton')
  const addHotKeyDiv = document.getElementById('addHotkeyDiv')
  let hotkeyCombination = []
  let selectedSites = []

  // Load stored sites and hotkeys from storage
  chrome.storage.sync.get(['sites', 'hotkeyBindings'], (result) => {
    const sites = result.sites || []
    const hotkeyBindings = result.hotkeyBindings || []
    loadSites(sites)
    loadHotkeyBindings(hotkeyBindings)
  })

  const toggleAddNewSite = () => {
    if (addSiteDiv.style.display === 'none') {
      addSiteDiv.style.display = 'block'
    } else {
      addSiteDiv.style.display = 'none'
    }
  }

  const toggleAddNewHotKey = () => {
    if (addHotKeyDiv.style.display === 'none') {
      addHotKeyDiv.style.display = 'block'
    } else {
      addHotKeyDiv.style.display = 'none'
    }
  }

  // Load sites into the list and checkboxes
  const loadSites = (sites) => {
    sitesList.innerHTML = ''
    siteCheckboxes.innerHTML = ''
    sites.forEach((site, index) => {
      const li = document.createElement('li')
      li.textContent = `${site.name}`
      sitesList.appendChild(li)

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = `site-${index}`
      checkbox.value = site.name
      siteCheckboxes.appendChild(checkbox)
      const label = document.createElement('label')
      label.htmlFor = `site-${index}`
      label.textContent = site.name
      siteCheckboxes.appendChild(label)
      siteCheckboxes.appendChild(document.createElement('br'))
    })
  }

  const loadHotkeyBindings = (hotkeyBindings) => {
    hotkeysList.innerHTML = ''
    hotkeyBindings.forEach((binding, index) => {
      const { hotkey, sites } = binding
      const li = document.createElement('li')
      li.className = 'hotkey-item'
      li.innerHTML = `
          ${hotkey.join(' + ')}: ${sites.join(', ')}
          <button class="editButton" data-index="${index}" >Edit</button>
          <button class="removeButton" data-index="${index}">Remove</button>
        `
      hotkeysList.appendChild(li)
    })
    attachHotkeyButtonsListeners()
  }

  const attachHotkeyButtonsListeners = () => {
    const container = document.querySelector('#hotkeysList') // test
    container.querySelectorAll('li.hotkey-item > .editButton').forEach((button) => {
      button.addEventListener('click', () => {
        console.log('Pressed edit button')
        toggleAddNewHotKey()
        const index = button.getAttribute('data-index')
        editHotkeyConfiguration(index)
      })
    })

    document.querySelectorAll('.removeButton').forEach((button) => {
      const listener = () => {
        const index = button.getAttribute('data-index')
        removeHotkeyConfiguration(index)
      }
      button.addEventListener('click', listener)
    })
  }

  const addSite = () => {
    const name = siteNameInput.value.trim()
    const ipUrl = siteIpUrlInput.value.trim()
    const domainUrl = siteDomainUrlInput.value.trim()
    const hashUrl = siteHashUrlInput.value.trim()

    if (name && (ipUrl || domainUrl || hashUrl)) {
      chrome.storage.sync.get('sites', (data) => {
        const sites = data.sites || []
        sites.push({
          name,
          urls: {
            ip: ipUrl,
            domain: domainUrl,
            hash: hashUrl,
          },
        })
        chrome.storage.sync.set({ sites }, () => {
          loadSites(sites)
          siteNameInput.value = ''
          siteIpUrlInput.value = ''
          siteDomainUrlInput.value = ''
          siteHashUrlInput.value = ''
        })
      })
    }
  }

  hotkeyInput.addEventListener('keydown', (event) => {
    event.preventDefault() // Prevent the default action to avoid unintended behavior
    const key = event.key
    if (!hotkeyCombination.includes(key)) {
      hotkeyCombination.push(key)
      hotkeyInput.value = hotkeyCombination.join(' + ')
      console.log('Hotkey combination updated:', hotkeyCombination)
    }
  })

  hotkeyInput.addEventListener('focus', () => {
    hotkeyCombination = []
    hotkeyInput.value = ''
    console.log('Hotkey input field focused. Hotkey combination reset.')
  })

  saveButton.addEventListener('click', () => {
    selectedSites = []
    const checkboxes = document.querySelectorAll('#siteCheckboxes input[type="checkbox"]:checked')
    checkboxes.forEach((checkbox) => selectedSites.push(checkbox.value))

    chrome.storage.sync.get('hotkeyBindings', (data) => {
      const hotkeyBindings = data.hotkeyBindings || []
      hotkeyBindings.push({
        hotkey: hotkeyCombination,
        sites: selectedSites,
      })

      chrome.storage.sync.set({ hotkeyBindings }, () => {
        alert('Hotkey and site bindings saved.')
        console.log('Hotkey and site bindings saved to storage:', hotkeyBindings)
        loadHotkeyBindings(hotkeyBindings)
      })
    })
  })

  const editHotkeyConfiguration = (index) => {
    chrome.storage.sync.get('hotkeyBindings', (data) => {
      const hotkeyBindings = data.hotkeyBindings || []
      const binding = hotkeyBindings[index]
      hotkeyCombination = binding.hotkey
      selectedSites = binding.sites

      hotkeyInput.value = hotkeyCombination.join(' + ')
      const checkboxes = document.querySelectorAll('#siteCheckboxes input[type="checkbox"]')
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectedSites.includes(checkbox.value)
      })

      // Remove the old configuration before saving the new one
      hotkeyBindings.splice(index, 1)
      chrome.storage.sync.set({ hotkeyBindings }, () => {
        console.log('Ready to edit hotkey configuration:', hotkeyCombination, selectedSites)
      })
    })
  }

  const removeHotkeyConfiguration = (index) => {
    chrome.storage.sync.get('hotkeyBindings', (data) => {
      const hotkeyBindings = data.hotkeyBindings || []
      hotkeyBindings.splice(index, 1)
      chrome.storage.sync.set({ hotkeyBindings }, () => {
        console.log('Hotkey configuration removed:', index)
        loadHotkeyBindings(hotkeyBindings)
      })
    })
  }

  addSiteButton.addEventListener('click', addSite)
  toggleAddNewSiteButton.addEventListener('click', toggleAddNewSite)
  toggleAddNewHotkeyButton.addEventListener('click', toggleAddNewHotKey)
})
