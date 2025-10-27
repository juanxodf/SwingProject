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
