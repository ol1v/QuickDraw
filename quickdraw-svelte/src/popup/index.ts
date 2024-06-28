import '../app.css'
import PopupPage from '../pages/popupPage.svelte'

const target = document.getElementById('app')

async function render() {
  if (target) new PopupPage({ target })
}

document.addEventListener('DOMContentLoaded', render)
