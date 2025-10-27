import { getEvents } from '../data/storage.js'

export function renderSchedule() {
    const app = document.querySelector('#program')
    const events = getEvents().filter(e => e.type === 'class')

    if (!app) return

    app.innerHTML = `
    <h3>Programa de Clases</h3>
    ${events.length === 0
            ? '<p>No hay clases registradas aún.</p>'
            : `
      <ul>
        ${events.map(e => `
          <li><strong>${e.name}</strong> (${e.style}, ${e.level}) – ${e.day} ${e.time} en ${e.room}</li>
        `).join('')}
      </ul>`
        }
  `
}
