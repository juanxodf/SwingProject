import { getEvents, deleteEvent } from '../data/storage.js'
import { openClassFormForEdit } from './formClass.js'
import { openActivityFormForEdit } from './formActivity.js'

const DAYS = ['Viernes', 'Sábado', 'Domingo']
const HOURS = [
  '20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00','04:00','05:00',
  '06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
  '16:00','17:00','18:00','19:00','20:00'
]

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

        // Click: abrir modal
        card.addEventListener('click', () => showEventModal(event))

        // Drag & drop
        card.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', JSON.stringify(event))
        })

        cell.appendChild(card)
      }

      cell.addEventListener('dragover', e => e.preventDefault())
      cell.addEventListener('drop', e => {
        e.preventDefault()
        const data = JSON.parse(e.dataTransfer.getData('text/plain'))
        const newDay = day
        const newTime = hour

        // Validar conflicto
        const conflict = events.find(ev =>
          (ev.room === data.room || ev.location === data.location) &&
          ev.day === newDay &&
          ev.time === newTime
        )
        if (conflict) {
          alert('⚠️ No se puede mover, la ubicación está ocupada.')
          return
        }

        // Actualizar evento
        deleteEvent(data.id)
        data.day = newDay
        data.time = newTime
        localStorage.setItem('events', JSON.stringify([...getEvents(), data]))
        renderSchedule()
      })

      row.appendChild(cell)
    })
    grid.appendChild(row)
  })

  container.appendChild(grid)
}

export function showEventModal(event) {
  const overlay = document.createElement('div')
  overlay.classList.add('modal-overlay')

  overlay.innerHTML = `
    <div class="modal-content">
      <h3>${event.name}</h3>
      <p><strong>Tipo:</strong> ${event.type || 'Clase'}</p>
      <p><strong>Profesores:</strong> ${event.teachers || '-'}</p>
      <p><strong>Estilo:</strong> ${event.style || '-'}</p>
      <p><strong>Nivel:</strong> ${event.level || '-'}</p>
      <p><strong>Ubicación:</strong> ${event.room || event.location}</p>
      <p><strong>Día:</strong> ${event.day}</p>
      <p><strong>Hora:</strong> ${event.time}</p>
      <p><strong>Banda:</strong> ${event.band || 'No'}</p>
      <p><strong>Descripción:</strong> ${event.description || '-'}</p>
      <button id="editEvent">Editar</button>
      <button id="deleteEvent">Eliminar</button>
      <button id="closeModal">Cerrar</button>
    </div>
  `

  document.body.appendChild(overlay)

  // Cerrar modal
  overlay.querySelector('#closeModal').addEventListener('click', () => overlay.remove())
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove() })

  // Editar evento dentro del modal
  overlay.querySelector('#editEvent').addEventListener('click', () => {
    const modalContent = overlay.querySelector('.modal-content')
    modalContent.innerHTML = ''

    if (event.room) {
      // Clase
      const form = renderClassForm()
      modalContent.appendChild(form)

      const classForm = form.querySelector('#classForm')
      classForm.name.value = event.name
      classForm.teachers.value = event.teachers
      classForm.style.value = event.style
      classForm.level.value = event.level
      classForm.day.value = event.day
      classForm.time.value = event.time
      classForm.room.value = event.room

      const msg = form.querySelector('#formMessage')
      msg.textContent = '✏️ Editando clase'

      classForm.onsubmit = e => {
        e.preventDefault()
        const updatedData = {
          ...event,
          name: classForm.name.value.trim(),
          teachers: classForm.teachers.value.trim(),
          style: classForm.style.value,
          level: classForm.level.value,
          day: classForm.day.value,
          time: classForm.time.value,
          room: classForm.room.value
        }
        updateEvent(updatedData)
        renderSchedule()
        overlay.remove()
      }
    } else {
      // Actividad
      const form = renderActivityForm()
      modalContent.appendChild(form)

      const activityForm = form.querySelector('#activityForm')
      activityForm.name.value = event.name
      activityForm.type.value = event.type
      activityForm.location.value = event.location
      activityForm.day.value = event.day
      activityForm.time.value = event.time
      activityForm.band.value = event.band
      activityForm.teachers.value = event.teachers || ''
      activityForm.style.value = event.style || ''
      activityForm.description.value = event.description || ''

      const msg = form.querySelector('#activityMessage')
      msg.textContent = '✏️ Editando actividad'

      activityForm.onsubmit = e => {
        e.preventDefault()
        const updatedData = {
          ...event,
          name: activityForm.name.value.trim(),
          type: activityForm.type.value,
          location: activityForm.location.value,
          day: activityForm.day.value,
          time: activityForm.time.value,
          band: activityForm.band.value,
          teachers: activityForm.teachers.value.trim(),
          style: activityForm.style.value.trim(),
          description: activityForm.description.value.trim()
        }
        updateEvent(updatedData)
        renderSchedule()
        overlay.remove()
      }
    }
  })

  // Eliminar evento
  overlay.querySelector('#deleteEvent').addEventListener('click', () => {
    if (confirm(`¿Deseas eliminar "${event.name}"?`)) {
      deleteEvent(event.id)
      renderSchedule()
      overlay.remove()
    }
  })
}

