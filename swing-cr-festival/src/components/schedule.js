import { getEvents, saveEvent, deleteEvent } from '../data/storage.js'

const DAYS = ['Viernes', 'Sábado', 'Domingo']
const HOURS = ['20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00']

export function renderSchedule() {
  const container = document.querySelector('#program')
  if (!container) return
  container.innerHTML = ''

  const events = getEvents()
  const grid = document.createElement('div')
  grid.classList.add('schedule-grid')

  const header = document.createElement('div')
  header.classList.add('schedule-header')
  DAYS.forEach(day => {
    const dayDiv = document.createElement('div')
    dayDiv.textContent = day
    dayDiv.classList.add('schedule-day')
    header.appendChild(dayDiv)
  })
  grid.appendChild(header)

  HOURS.forEach(hour => {
    const row = document.createElement('div')
    row.classList.add('schedule-row')
    DAYS.forEach(day => {
      const cell = document.createElement('div')
      cell.classList.add('schedule-cell')

      const event = events.find(e => e.day === day && e.time === hour)
      if (event) {
        const card = document.createElement('div')
        card.classList.add('schedule-card')
        if (event.room) card.classList.add('class-card')
        else card.classList.add('activity-card')

        card.textContent = `${event.name} (${event.room || event.location})`
        card.setAttribute('draggable', 'true')

        // Abrir modal al click
        card.addEventListener('click', () => showEventModal(event))

        // Drag start
        card.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', JSON.stringify(event))
        })

        cell.appendChild(card)
      }

      // Drop zone
      cell.addEventListener('dragover', e => e.preventDefault())

      cell.addEventListener('drop', e => {
        e.preventDefault()
        const data = JSON.parse(e.dataTransfer.getData('text/plain'))

        const newDay = day
        const newTime = hour

        // Validar si la ubicación ya está ocupada
        const conflict = events.find(
          ev =>
            (ev.room === data.room || ev.location === data.location) &&
            ev.day === newDay &&
            ev.time === newTime
        )
        if (conflict) {
          alert('⚠️ No se puede mover, la ubicación está ocupada en ese horario.')
          return
        }

        // Eliminar el evento original y crear el actualizado
        deleteEvent(data.id)
        data.day = newDay
        data.time = newTime
        saveEvent(data)
        renderSchedule()
      })

      row.appendChild(cell)
    })
    grid.appendChild(row)
  })

  container.appendChild(grid)
}
