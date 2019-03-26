const rehydrated = JSON.parse(localStorage.getItem('persist')) || {}

const portfolio = new Mosaic.Portfolio({
  ...rehydrated,
  adapters: [],
  loaded: false,
}, (type, state, payload) => {
  console.log(type, payload)
  let adapter;
  switch (type) {
    case 'LOADED':
      state.loaded = true
      break
    case 'ADD_ADAPTER':
      state.adapters.push({
        name: payload.name,
        instance: payload.instance,
        auth: {},
      })
      break
    case 'ENABLE_ADAPTER':
      adapter = state.adapters.find(adapter => adapter.name === payload)
      adapter.enabled = true
      break
    case 'DISABLE_ADAPTER':
      adapter = state.adapters.find(adapter => adapter.name === payload)
      adapter.enabled = false
      break
    case 'AUTH_ADAPTER':
      adapter = state.adapters.find(adapter => adapter.name === payload.name)
      adapter.auth = payload.auth
      break
    default:
      break
  }
  localStorage.setItem('persist', JSON.stringify(state))
})

window.portfolio = portfolio

window.store = {
  dispatch: (action) => {
    return portfolio.dispatch(action.type, action.payload)
  },
  get: (key) => portfolio.get(key),
  getState: () => portfolio.data,
}

window.actions = {
  count: () => store.dispatch({
    type: 'COUNT',
    payload: Math.random() + 'a',
  }),
  handleChange: (e) => {
    store.dispatch({
      type: 'COUNT',
      payload: e.target.value,
    })
  },
  toggleAdapter: (name, enabled) => {
    store.dispatch({
      type: enabled ? 'ENABLE_ADAPTER' : 'DISABLE_ADAPTER',
      payload: name,
    })
  },
  authAdapter: (name, auth) => {
    store.dispatch({
      type: 'AUTH_ADAPTER',
      payload: {
        name,
        auth,
      },
    })
  },
}