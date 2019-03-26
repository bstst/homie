import Adapters from './Adapters.js'

const app = new Mosaic({
  element: '#main',
  portfolio,
  view: function () {
    return html `
      <div>
        ${!store.get('loaded') ? 'loading' : Adapters.new()}
      </div>
    `
  }
})

app.paint()
window.app = app;
