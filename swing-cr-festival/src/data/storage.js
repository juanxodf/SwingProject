export function initStorage() {
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]))
  }
}

export function getEvents() {
  return JSON.parse(localStorage.getItem('events')) || []
}

export function saveEvent(event) {
  const events = getEvents()
  events.push(event)
  localStorage.setItem('events', JSON.stringify(events))
}

export function deleteEvent(id) {
  const events = getEvents().filter(e => e.id !== id)
  localStorage.setItem('events', JSON.stringify(events))
}

// Salas y ubicaciones
export const CLASS_ROOMS = ['Be Hopper', 'New Orleans', 'Savoy']
export const OTHER_LOCATIONS = ['Antiguo Casino', 'Parque de Gasset', 'Prado']

export function getAvailableRooms(day, time) {
  const events = getEvents()
  return CLASS_ROOMS.filter(
    room => !events.some(e => e.room === room && e.day === day && e.time === time)
  )
}

export function getAvailableLocations(day, time) {
  const events = getEvents()
  const allLocations = [...CLASS_ROOMS, ...OTHER_LOCATIONS]
  return allLocations.filter(
    loc =>
      !events.some(
        e => (e.room === loc || e.location === loc) && e.day === day && e.time === time
      )
  )
}
