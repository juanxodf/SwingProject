import { ActivityEvent } from '../models/Activity.js'
import { getEvents, saveEvent, getAvailableLocations, CLASS_ROOMS, updateEvent } from '../data/storage.js'
import { renderSchedule } from './schedule.js'

let originalSubmitHandler

export function renderActivityForm() {
  const section = document.createElement('section')
  section.classList.add('form-section')

  section.innerHTML = `
    <h3>Registrar Actividad</h3>
    <form id="activityForm">
      <label>Nombre de la actividad:</label>
      <input type="text" id="name" required />

      <label>Tipo:</label>
      <select id="type" required>
        <option value="">Selecciona...</option>
        <option>Social</option>
        <option>Concierto</option>
        <option>Taster</option>
        <option>Mix & Match</option>
      </select>

      <label>Ubicación:</label>
      <select id="location" required></select>

      <label>Día:</label>
      <select id="day" required>
        <option value="">Selecciona...</option>
        <option>Viernes</option>
        <option>Sábado</option>
        <option>Domingo</option>
      </select>

      <label>Hora:</label>
      <input type="time" id="time" required />

      <label>Hay banda en directo:</label>
      <select id="band">
        <option value="No">No</option>
        <option value="Sí">Sí</option>
      </select>

      <label>Profesores implicados:</label>
      <input type="text" id="teachers" placeholder="Opcional" />

      <label>Estilo:</label>
      <input type="text" id="style" placeholder="Opcional" />

      <label>Descripción:</label>
      <textarea id="description" placeholder="Detalles opcionales..."></textarea>

      <button type="submit">Registrar Actividad</button>
    </form>
    <p id="activityMessage"></p>
  `

  const form = section.querySelector('#activityForm')
  originalSubmitHandler = form.onsubmit

  const locationSelect = section.querySelector('#location')
  const daySelect = section.querySelector('#day')
  const timeInput = section.querySelector('#time')
  const msg = section.querySelector('#activityMessage')

  function validFestivalTime(day, time) {
    const dayOrder = { 'Viernes': 1, 'Sábado': 2, 'Domingo': 3 }
    if (!dayOrder[day]) return false
    if (day === 'Viernes' && time < '20:00') return false
    if (day === 'Domingo' && time > '20:00') return false
    return true
  }

  function updateAvailableLocations() {
    const day = daySelect.value
    const time = timeInput.value
    locationSelect.innerHTML = '<option value="">Selecciona...</option>'

    if (!day || !time) return

    const available = getAvailableLocations(day, time)
    if (available.length === 0) {
      msg.textContent = '⚠️ No hay ubicaciones disponibles en este horario.'
    } else {
      msg.textContent = ''
      available.forEach(l => {
        const opt = document.createElement('option')
        opt.value = l
        opt.textContent = l
        locationSelect.appendChild(opt)
      })
    }
  }

  daySelect.addEventListener('change', updateAvailableLocations)
  timeInput.addEventListener('change', updateAvailableLocations)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = {
      name: form.name.value.trim(),
      type: form.type.value,
      location: locationSelect.value,
      day: daySelect.value,
      time: timeInput.value,
      band: form.band.value,
      teachers: form.teachers.value.trim(),
      style: form.style.value.trim(),
      description: form.description.value.trim()
    }

    if (!data.name || !data.type || !data.location || !data.day || !data.time) {
      msg.textContent = '❌ Todos los campos obligatorios deben estar completos.'
      return
    }

    if (!validFestivalTime(data.day, data.time)) {
      msg.textContent = '❌ Hora fuera del rango del festival.'
      return
    }

    const events = getEvents()
    const conflict = events.find(
      e => e.location === data.location && e.day === data.day && e.time === data.time
    )
    if (conflict) {
      msg.textContent = '⚠️ Ya existe una actividad en esa ubicación y hora.'
      return
    }

    const classRooms = CLASS_ROOMS
    if (classRooms.includes(data.location)) {
      const classConflict = events.find(
        e => e.room === data.location && e.day === data.day && e.time === data.time
      )
      if (classConflict) {
        msg.textContent = '⚠️ La sala está ocupada con una clase.'
        return
      }
    }

    const newActivity = new ActivityEvent(data)
    saveEvent(newActivity)
    msg.textContent = '✅ Actividad registrada correctamente.'
    form.reset()
    updateAvailableLocations()
    renderSchedule()
  })

  return section
}

export function openActivityFormForEdit(eventData, renderSchedule) {
  const formContainer = document.querySelector('#formContainer')
  const activityFormSection = formContainer.querySelectorAll('.form-section')[1] // segunda sección
  const form = activityFormSection.querySelector('#activityForm')

  // Rellenar formulario
  form.name.value = eventData.name
  form.type.value = eventData.type
  form.location.value = eventData.location
  form.day.value = eventData.day
  form.time.value = eventData.time
  form.band.value = eventData.band
  form.teachers.value = eventData.teachers
  form.style.value = eventData.style
  form.description.value = eventData.description

  const msg = activityFormSection.querySelector('#activityMessage')
  msg.textContent = '✏️ Editando actividad existente'

  const originalSubmit = form.onsubmit

  form.onsubmit = e => {
    e.preventDefault()

    const updatedData = {
      ...eventData,
      name: form.name.value.trim(),
      type: form.type.value,
      location: form.location.value,
      day: form.day.value,
      time: form.time.value,
      band: form.band.value,
      teachers: form.teachers.value.trim(),
      style: form.style.value.trim(),
      description: form.description.value.trim()
    }

    deleteEvent(eventData.id)
    saveEvent(updatedData)

    msg.textContent = '✅ Actividad actualizada correctamente'
    form.reset()
    renderSchedule()

    form.onsubmit = originalSubmit
  }
}
