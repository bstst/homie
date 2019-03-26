const { Provider, connect } = ReactRedux;
const { createStore, combineReducers, applyMiddleware } = Redux;

const defaultAppState = {
  loading: true,
};

const app = (state = defaultAppState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'LOADED':
      return { ...state, loading: false };
    case 'STORAGE':
      return { ...state, storage: payload };
  }
  return state;
}

const adapters = (state = {}, action = {}) => {
  const { type, payload: { name } = {} } = action;
  const adapter = state[name] || { auth: {} };
  switch (type) {
    case 'ADD_ADAPTER':
      return { ...state, [name]: { ...adapter } };
    case 'ENABLE_ADAPTER':
      return { ...state, [name]: { ...adapter, enabled: true } };
    case 'DISABLE_ADAPTER':
      return { ...state, [name]: { ...adapter, enabled: false } };
    case 'AUTH_ADAPTER':
      return { ...state, [name]: { ...adapter, auth: action.payload.auth } };
  }
  return state;
}

const storage = {
  getItem: function getItem(key) {
    return new Promise(function (resolve, reject) {
      resolve(window.localStorage.getItem(key));
    });
  },
  setItem: function setItem(key, item) {
    return new Promise(function (resolve, reject) {
      resolve(window.localStorage.setItem(key, item));
    });
  },
  removeItem: function removeItem(key) {
    return new Promise(function (resolve, reject) {
      resolve(window.localStorage.removeItem(key));
    });
  }
};

const reducers = combineReducers({ app, adapters });

const { persistStore, persistReducer } = window.ReduxPersist;

const persistConfig = {
  key: 'persist',
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persistedReducer,
  applyMiddleware(ReduxThunk.default),
);

const persistor = persistStore(store);

class StorageManagerComponent extends React.Component {
  state = {
    collapsed: true,
  }
  
  renderAdapter = (name) => {
    const adapter = H.getAdapter(name);
    if (!adapter) {
      return null;
    }
    return (
      <div key={name}>
        {name}
        {adapter.auth().map((item) => {
          switch (item.type) {
            case 'text':
              return (
                <div key={item.name}>
                  <input
                    type="checkbox"
                    checked={this.props.adapters[name].enabled}
                    onChange={(e) => {
                      // console.log(e.target.checked);
                      if (e.target.checked) {
                        this.props.dispatch((dispatch) => dispatch({
                          type: 'ENABLE_ADAPTER',
                          payload: {
                            name,
                          },
                        }));
                      } else {
                        this.props.dispatch((dispatch) => dispatch({
                          type: 'DISABLE_ADAPTER',
                          payload: {
                            name,
                          },
                        }));
                      }
                    }}
                  />
                  <label>
                    <span>
                      {item.label}
                    </span>
                    <input
                      type="text"
                      name={item.name}
                      value={this.props.adapters[name].auth[item.name]}
                      onChange={(e) => {
                        this.props.dispatch((dispatch) => dispatch({
                          type: 'AUTH_ADAPTER',
                          payload: {
                            name,
                            auth: {
                              [item.name]: e.target.value,
                            },
                          },
                        }));
                      }}
                    />
                  </label>
                </div>
              );
          }
        })}
      </div>
    );
  }

  render () {
    return (
      <div>
        <span
          onClick={() => this.setState({ collapsed: !this.state.collapsed })}
        >
          adapters:
        </span>
        {
          this.state.collapsed
            ? Object.values(this.props.adapters).filter((item) => item.enabled).length
            : Object.keys(this.props.adapters).map(this.renderAdapter)
        }
      </div>
    );
  }
}

const StorageManager = connect((state) => {
  return {
    adapters: state.adapters,
  };
})(StorageManagerComponent);

class App extends React.Component {
  render () {
    if (this.props.loading) {
      return (<div className="loading">loading</div>);
    }
    return (
      <div>
        <StorageManager />
      </div>
    );
  }
}

const ConnectedApp = connect((state) => {
  return {
    loading: state.app.loading || !state._persist.rehydrated,
  };
})(App);

ReactDOM.render((
  <Provider store={store}><ConnectedApp /></Provider>
), document.querySelector('#main'));