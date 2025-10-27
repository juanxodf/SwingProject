import { getEvents } from '../data/storage.js'

export function renderSchedule() {
  const app = document.querySelector('#program')
  const events = getEvents()

  if (!app) return

  // Separar clases y actividades
  const classes = events.filter(e => e.type === 'class')
  const activities = events.filter(e => e.kind === 'activity')

  app.innerHTML = `
    <h3>Programa del Festival</h3>

    <h4>Clases</h4>
    ${
      classes.length === 0
        ? '<p>No hay clases registradas.</p>'
        : `<ul>${classes.map(c => `
            <li><strong>${c.name}</strong> (${c.style}, ${c.level}) – ${c.day} ${c.time} en ${c.room}</li>
          `).join('')}</ul>`
    }

    <h4>Actividades</h4>
    ${
      activities.length === 0
        ? '<p>No hay actividades registradas.</p>'
        : `<ul>${activities.map(a => `
            <li><strong>${a.name}</strong> (${a.type}) – ${a.day} ${a.time} en ${a.location}</li>
          `).join('')}</ul>`
    }
  `
}
