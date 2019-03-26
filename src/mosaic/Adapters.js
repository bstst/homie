const Auth = new Mosaic({
  actions: {
    handleChange: function (e) {
      console.log(e.target.value)
    },
  },
  view: function () {
    const { label, name, adapter, type } = this.data
    return html `
      <div>
        ${adapter} ${label} ${name}
        <input type=${type} onchange=${this.actions.handleChange} />
      </div>
    `
  },
})

const Adapter = new Mosaic({
  actions: {
    handleChange: function () {
      actions.toggleAdapter(this.data.name, !this.data.enabled)
    },
  },
  view: function () {
    // const adapter = H.getAdapter(this.data.name)
    // const auth = adapter ? adapter.auth() : false
  
    return html `
      <div>
        ${this.data.name}
        <span onclick=${this.actions.handleChange}>
          ${this.data.enabled ? '☑' : '☐'}
        </span>
        <div>
          ${this.data.instance ? this.data.instance.auth().map(auth => Auth.new({ ...auth, adapter: this.data.name })) : ''}
        </div>
      </div>
    `
  },
});

const Adapters = new Mosaic({
  portfolio,
  view: function () {
    return html `
      <div>
        ${store.get('adapters').map(adapter => Adapter.new({ ...adapter }))}
      </div>
    `
  }
})

export default Adapters;