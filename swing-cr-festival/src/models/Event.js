export class Event {
  constructor({ id, name, type, location, day, time, description }) {
    this.id = id || crypto.randomUUID()
    this.name = name
    this.type = type
    this.location = location
    this.day = day
    this.time = time
    this.description = description
  }
}
