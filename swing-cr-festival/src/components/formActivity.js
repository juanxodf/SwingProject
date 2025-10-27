import { ActivityEvent } from '../models/Activity.js'
import { getEvents, saveEvent } from '../data/storage.js'
import { renderSchedule } from './schedule.js'

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
      <select id="location" required>
        <option value="">Selecciona...</option>
        <option>Antiguo Casino</option>
        <option>Parque de Gasset</option>
        <option>Prado</option>
        <option>Be Hopper</option>
        <option>New Orleans</option>
        <option>Savoy</option>
      </select>

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
      <input type="text" id="style" placeholder="Opcional (Lindy Hop, Shag...)" />

      <label>Descripción:</label>
      <textarea id="description" placeholder="Detalles opcionales..."></textarea>

      <button type="submit">Registrar Actividad</button>
    </form>
    <p id="activityMessage"></p>
  `

  const form = section.querySelector('#activityForm')
  const msg = section.querySelector('#activityMessage')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const data = {
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

    // Validar campos requeridos
    if (!data.name || !data.type || !data.location || !data.day || !data.time) {
      msg.textContent = '❌ Todos los campos obligatorios deben estar completos.'
      return
    }

    // Validar rango horario
    if (!validFestivalTime(data.day, data.time)) {
      msg.textContent = '❌ Hora fuera del rango del festival.'
      return
    }

    // Validar solapamiento (ubicación)
    const events = getEvents()
    const conflict = events.find(
      e => e.location === data.location && e.day === data.day && e.time === data.time
    )
    if (conflict) {
      msg.textContent = '⚠️ Ya existe una actividad en esa ubicación y hora.'
      return
    }

    // Si es una sala de clases, comprobar que esté libre
    const classRooms = ['Be Hopper', 'New Orleans', 'Savoy']
    if (classRooms.includes(data.location)) {
      const classConflict = events.find(
        e => e.room === data.location && e.day === data.day && e.time === data.time
      )
      if (classConflict) {
        msg.textContent = '⚠️ La sala está ocupada con una clase.'
        return
      }
    }

    // Crear y guardar la actividad
    const newActivity = new ActivityEvent(data)
    saveEvent(newActivity)

    msg.textContent = '✅ Actividad registrada correctamente.'
    form.reset()

    renderSchedule()
  })

  return section
}

// Reutilizamos la validación del rango del festival
function validFestivalTime(day, time) {
  const dayOrder = { 'Viernes': 1, 'Sábado': 2, 'Domingo': 3 }
  if (!dayOrder[day]) return false
  if (day === 'Viernes' && time < '20:00') return false
  if (day === 'Domingo' && time > '20:00') return false
  return true
}
