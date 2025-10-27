import { ClassEvent } from '../models/Class.js'
import { saveEvent, getEvents, getAvailableRooms, updateEvent } from '../data/storage.js'
import { renderSchedule } from './schedule.js'

export function renderClassForm() {
  const formContainer = document.createElement('section')
  formContainer.classList.add('form-section', 'class')

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
      <label>Día:</label>
      <select id="day" required>
        <option value="">Selecciona...</option>
        <option>Viernes</option>
        <option>Sábado</option>
        <option>Domingo</option>
      </select>
      <label>Hora:</label>
      <input type="time" id="time" required />
      <label>Sala:</label>
      <select id="room" required><option value="">Selecciona...</option></select>
      <button type="submit">Registrar Clase</button>
    </form>
    <p id="formMessage"></p>
  `

  const form = formContainer.querySelector('#classForm')
  const daySelect = formContainer.querySelector('#day')
  const timeInput = formContainer.querySelector('#time')
  const roomSelect = formContainer.querySelector('#room')
  const msg = formContainer.querySelector('#formMessage')

  function updateAvailableRooms() {
    const day = daySelect.value
    const time = timeInput.value
    roomSelect.innerHTML = '<option value="">Selecciona...</option>'
    if (!day || !time) return
    const availableRooms = getAvailableRooms(day, time)
    if (availableRooms.length === 0) msg.textContent = '⚠️ No hay salas disponibles.'
    else {
      msg.textContent = ''
      availableRooms.forEach(r => {
        const opt = document.createElement('option')
        opt.value = r
        opt.textContent = r
        roomSelect.appendChild(opt)
      })
    }
  }

  daySelect.addEventListener('change', updateAvailableRooms)
  timeInput.addEventListener('change', updateAvailableRooms)

  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = {
      name: form.name.value.trim(),
      teachers: form.teachers.value.trim(),
      style: form.style.value,
      level: form.level.value,
      day: daySelect.value,
      time: timeInput.value,
      room: roomSelect.value
    }

    if (Object.values(data).some(v => v === '')) {
      msg.textContent = '❌ Todos los campos son obligatorios.'
      return
    }

    const events = getEvents()
    const conflict = events.find(e => e.room === data.room && e.day === data.day && e.time === data.time)
    if (conflict) {
      msg.textContent = '⚠️ Ya hay una clase en esa sala y hora.'
      return
    }

    const newClass = new ClassEvent(data)
    saveEvent(newClass)
    msg.textContent = '✅ Clase registrada correctamente.'
    form.reset()
    updateAvailableRooms()
    renderSchedule()
  })

  return formContainer
}

// HU7: editar clase existente
export function openClassFormForEdit(eventData, callback) {
  const form = document.querySelector('#classForm')
  if (!form) return
  const msg = document.querySelector('#formMessage')

  form.name.value = eventData.name
  form.teachers.value = eventData.teachers
  form.style.value = eventData.style
  form.level.value = eventData.level
  form.day.value = eventData.day
  form.time.value = eventData.time
  form.room.value = eventData.room

  msg.textContent = '✏️ Editando clase existente'

  form.onsubmit = e => {
    e.preventDefault()
    const updatedData = {
      ...eventData,
      name: form.name.value.trim(),
      teachers: form.teachers.value.trim(),
      style: form.style.value,
      level: form.level.value,
      day: form.day.value,
      time: form.time.value,
      room: form.room.value
    }
    updateEvent(updatedData)
    callback() // refresca schedule y cierra modal
    form.reset()
    form.onsubmit = null
  }
}
