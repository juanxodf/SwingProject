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

        // Placeholder para modal info (HU5)
        card.addEventListener('click', () => {
          alert(JSON.stringify(event, null, 2))
        })

        cell.appendChild(card)
      }

      row.appendChild(cell)
    })

    grid.appendChild(row)
  })

  container.appendChild(grid)
}
