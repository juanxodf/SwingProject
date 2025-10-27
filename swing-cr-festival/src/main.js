import './styles/main.css'
import './styles/schedule.css'
import { initStorage } from './data/storage.js'
import { renderHomeView } from './views/homeView.js'

// Inicializa almacenamiento local y vista principal
document.addEventListener('DOMContentLoaded', () => {
  initStorage()
  renderHomeView()
})
