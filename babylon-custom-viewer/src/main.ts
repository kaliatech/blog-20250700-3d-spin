import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
  <p>Test</p>
  <button id="counter">Counter</button>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
