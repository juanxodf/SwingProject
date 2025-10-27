export class ActivityEvent {
  constructor({ id, name, type, location, day, time, description, band, teachers, style }) {
    this.id = id || crypto.randomUUID()
    this.name = name
    this.type = type 
    this.location = location
    this.day = day
    this.time = time
    this.description = description
    this.band = band
    this.teachers = teachers
    this.style = style
    this.kind = 'activity' // Distinción interna
  }
}
