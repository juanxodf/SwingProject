import { getEvents } from '../data/storage.js'

const DAYS = ['Viernes', 'Sábado', 'Domingo']
const HOURS = [
  '20:00', '21:00', '22:00', '23:00',
  '00:00', '01:00', '02:00', '03:00',
  '04:00', '05:00', '06:00', '07:00',
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00'
]

export function renderSchedule() {
  const container = document.querySelector('#program')
  if (!container) return

  container.innerHTML = '' // Limpiar contenido previo
  const events = getEvents()

  // Crear grid principal
  const grid = document.createElement('div')
  grid.classList.add('schedule-grid')

  // Encabezado con días
  const header = document.createElement('div')
  header.classList.add('schedule-header')
  DAYS.forEach(day => {
    const dayDiv = document.createElement('div')
    dayDiv.textContent = day
    dayDiv.classList.add('schedule-day')
    header.appendChild(dayDiv)
  })
  grid.appendChild(header)

  // Crear filas por hora
  HOURS.forEach(hour => {
    const row = document.createElement('div')
    row.classList.add('schedule-row')

    DAYS.forEach(day => {
      const cell = document.createElement('div')
      cell.classList.add('schedule-cell')

      // Buscar evento que coincida con este día y hora
      const event = events.find(e => e.day === day && e.time === hour)
      if (event) {
        const card = document.createElement('div')
        card.classList.add('schedule-card')
        // Diferenciar clases y actividades
        if (event.room) card.classList.add('class-card')
        else card.classList.add('activity-card')

        card.textContent = `${event.name} (${event.room || event.location})`

        card.addEventListener('click', () => {
          showEventModal(event)
        })

        cell.appendChild(card)
      }

      row.appendChild(cell)
    })

    grid.appendChild(row)
  })

  container.appendChild(grid)
}

export function showEventModal(event) {
  // Crear fondo del modal
  const overlay = document.createElement('div')
  overlay.classList.add('modal-overlay')

  // Crear contenido del modal
  const modal = document.createElement('div')
  modal.classList.add('modal-content')

  modal.innerHTML = `
    <h3>${event.name}</h3>
    <ul>
      ${event.type ? `<li><strong>Tipo:</strong> ${event.type}</li>` : ''}
      ${event.room ? `<li><strong>Sala:</strong> ${event.room}</li>` : ''}
      ${event.location ? `<li><strong>Ubicación:</strong> ${event.location}</li>` : ''}
      ${event.teachers ? `<li><strong>Profesores:</strong> ${event.teachers}</li>` : ''}
      ${event.style ? `<li><strong>Estilo:</strong> ${event.style}</li>` : ''}
      ${event.level ? `<li><strong>Nivel:</strong> ${event.level}</li>` : ''}
      ${event.band ? `<li><strong>Banda:</strong> ${event.band}</li>` : ''}
      ${event.description ? `<li><strong>Descripción:</strong> ${event.description}</li>` : ''}
      <li><strong>Día:</strong> ${event.day}</li>
      <li><strong>Hora:</strong> ${event.time}</li>
    </ul>
    <button id="closeModal">Cerrar</button>
  `

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  // Cerrar modal
  document.querySelector('#closeModal').addEventListener('click', () => {
    overlay.remove()
  })

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove()
  })
}