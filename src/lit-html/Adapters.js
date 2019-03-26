import { html } from 'https://unpkg.com/lit-html?module'

const handleAdapterChange = (name, checked) => {
  if (checked) {
    store.dispatch({
      type: 'ENABLE_ADAPTER',
      payload: name,
    })
  } else {
    store.dispatch({
      type: 'DISABLE_ADAPTER',
      payload: name,
    })
  }
}

const handleAdapterAuthChange = (adapter, name, value) => {
  store.dispatch({
    type: 'AUTH_ADAPTER',
    payload: {
      name: adapter,
      auth: {
        [name]: value,
      },
    },
  })
}

const Adapter = (adapter) => {
  return html `
    <style>
      .adapter {
        padding: 10px;
        border: 1px solid #eee;
      }
    </style>
    <div class="adapter">
      ${adapter.name}
      <input
        type="checkbox"
        ?checked=${adapter.enabled ? 'checked' : ''}
        @change=${(e) => handleAdapterChange(adapter.name, e.target.checked)}
      />
      ${adapter.instance.auth().map(auth => {
        return html `
          <div>
            ${auth.name}
            <input
              type=${auth.type}
              value=${adapter.auth[auth.name] || ''}
              @change=${(e) => handleAdapterAuthChange(adapter.name, auth.name, e.target.value)}
            />
          </div>
        `
      })}
    </div>
  `
}

const Adapters = () => {
  const adapters = store.get('adapters')
  const enabledAdapters = adapters.filter(adapter => adapter.enabled).length
  return html `
    <div>
      <div @click=${() => store.dispatch({ type: 'TOGGLE_ADAPTERS' })}>
        enabled: ${enabledAdapters}
      </div>
      ${
        store.get('app').expandAdapters
        ? adapters.map(Adapter)
        : ''
      }
    </div>
  `
}

export default Adapters
