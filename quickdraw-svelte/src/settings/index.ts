import '../app.css'
import SettingsPage from '../pages/settingsPage.svelte'

const target = document.getElementById('app')

async function render() {
  if (target) new SettingsPage({ target })
}

document.addEventListener('DOMContentLoaded', render)
