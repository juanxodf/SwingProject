export class ClassEvent {
  constructor({ id, name, teachers, style, level, room, day, time }) {
    this.id = id || crypto.randomUUID()
    this.name = name
    this.teachers = teachers
    this.style = style
    this.level = level
    this.room = room
    this.day = day
    this.time = time
    this.type = 'class' // Distinción interna
  }
}
