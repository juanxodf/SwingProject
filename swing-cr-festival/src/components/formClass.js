import { ClassEvent } from '../models/Class.js'
import { saveEvent, getEvents } from '../data/storage.js'
import { renderSchedule } from './schedule.js'

export function renderClassForm() {
  const formContainer = document.createElement('section')
  formContainer.classList.add('form-section')

  formContainer.innerHTML = `
    <h3>Registrar Clase</h3>
    <form id="classForm">
      <label>Nombre de la clase:</label>
      <input type="text" id="name" required />

      <label>Profesores:</label>
      <input type="text" id="teachers" required />

      <label>Estilo:</label>
      <select id="style" required>
        <option value="">Selecciona...</option>
        <option>Lindy Hop</option>
        <option>Shag</option>
        <option>Solo Jazz</option>
      </select>

      <label>Nivel:</label>
      <select id="level" required>
        <option value="">Selecciona...</option>
        <option>Básico</option>
        <option>Intermedio</option>
        <option>Avanzado</option>
      </select>

      <label>Sala:</label>
      <select id="room" required>
        <option value="">Selecciona...</option>
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

      <button type="submit">Registrar Clase</button>
    </form>
    <p id="formMessage"></p>
  `

  const form = formContainer.querySelector('#classForm')
  const message = formContainer.querySelector('#formMessage')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Obtener datos del formulario
    const data = {
      name: form.name.value.trim(),
      teachers: form.teachers.value.trim(),
      style: form.style.value,
      level: form.level.value,
      room: form.room.value,
      day: form.day.value,
      time: form.time.value
    }

    // Validar campos requeridos
    if (Object.values(data).some(v => v === '')) {
      message.textContent = '❌ Todos los campos son obligatorios.'
      return
    }

    // Validar rango horario
    if (!validFestivalTime(data.day, data.time)) {
      message.textContent = '❌ Hora fuera del rango del festival.'
      return
    }

    // Validar solapamiento
    const events = getEvents()
    const conflict = events.find(e => e.room === data.room && e.day === data.day && e.time === data.time)

    if (conflict) {
      message.textContent = '⚠️ Ya hay una clase en esa sala y hora.'
      return
    }

    // Crear clase y guardar
    const newClass = new ClassEvent(data)
    saveEvent(newClass)

    message.textContent = '✅ Clase registrada correctamente.'
    form.reset()

    // Actualizar visualización
    renderSchedule()
  })

  return formContainer
}

// Valida el horario del festival
function validFestivalTime(day, time) {
  const dayOrder = { 'Viernes': 10, 'Sábado': 11, 'Domingo': 12 }
  if (!dayOrder[day]) return false

  // Viernes: a partir de 20:00
  if (day === 'Viernes' && time < '20:00') return false
  // Domingo: hasta 20:00
  if (day === 'Domingo' && time > '20:00') return false

  return true
}
