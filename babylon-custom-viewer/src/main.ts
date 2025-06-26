import './style.css'
import { initBabylon } from './initBabylon.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="viewer-container">
    <div class="square-container">
      <canvas id="bjsCanvas"></canvas>
    </div>
  </div>
`
initBabylon(document.querySelector<HTMLCanvasElement>('#bjsCanvas')!)
