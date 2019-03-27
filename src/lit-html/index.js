import { html, render } from 'https://unpkg.com/lit-html?module'
import Adapters from './Adapters.js'
import Messages from './Messages.js'

const app = () => html `
  <div>
    ${Adapters()}
    ${Messages()}
  </div>
`

const rerender = () => {
  // console.log('render')
  render(app(), document.getElementById('main'))
}
rerender()
store.setRender(rerender)
