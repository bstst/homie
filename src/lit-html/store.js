const rehydrated = JSON.parse(localStorage.getItem('persist')) || {}

const state = {
  adapters: [],
  app: {
    expandAdapters: false,
  },
  ...rehydrated,
  loaded: false,
};

let render

window.store = {
  setRender: (r) => render = r,
  dispatch: ({ type, payload }) => {
    console.log(type, payload)
    switch (type) {
      case 'LOADED':
        state.loaded = true
        break
      case 'ADD_ADAPTER':
        adapter = state.adapters.find(adapter => adapter.name === payload.name)
        if (adapter) {
          adapter.instance = payload.instance
          break
        }
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
      case 'TOGGLE_ADAPTERS':
        state.app.expandAdapters = !state.app.expandAdapters
        break
      default:
        break
    }
    localStorage.setItem('persist', JSON.stringify(state))
    render && render()
  },
  get: (key) => state[key],
  getState: () => state,
}