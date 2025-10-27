import { renderClassForm } from '../components/formClass.js'
import { renderActivityForm } from '../components/formActivity.js'
import { renderSchedule } from '../components/schedule.js'

export function renderHomeView() {
  const app = document.querySelector('#app')

  // Estructura principal de la página
  app.innerHTML = `
    <h1>Festival Swing CR 2026</h1>
    <div id="formsContainer"></div>
    <h2>Programa del Festival</h2>
    <div id="program"></div>
    <div id="formContainer"></div>
  `

  const formsContainer = document.querySelector('#formsContainer')

  // Agregar los formularios de clases y actividades
  formsContainer.appendChild(renderClassForm())
  formsContainer.appendChild(renderActivityForm())

  // Renderizar el programa completo
  renderSchedule()
}
