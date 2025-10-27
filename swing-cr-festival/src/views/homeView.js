import { renderClassForm } from '../components/formClass.js'
import { renderSchedule } from '../components/schedule.js'

export function renderHomeView() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <section id="formContainer"></section>
    <section id="program"></section>
  `

  const formSection = document.querySelector('#formContainer')
  formSection.appendChild(renderClassForm())

  renderSchedule()
}
