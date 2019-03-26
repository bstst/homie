const load = (src, callback) => {
  return new Promise((resolve) => {
    import(src).then((module) => {
      resolve(callback && callback(module.default));
    });
  });
};

function Homie () {
  let _storage;
  const _adapters = [];

  const setStorage = (storage) => _storage = storage;
  const getStorage = () => _storage;

  const addAdapter = (adapter) => _adapters.push(adapter);

  const getAdapter = (name) => _adapters.find(item => item.name() === name);

  return {
    setStorage,
    getStorage,
    addAdapter,
    getAdapter,
  };
}

const H = new Homie();

const handleStorage = (Storage) => {
  H.setStorage(new Storage());
  store.dispatch({
    type: 'STORAGE',
    payload: true,
  });
};

const handleGithub = (Module) => {
  const adapter = new Module();
  H.addAdapter(adapter);
  store.dispatch({
    type: 'ADD_ADAPTER',
    payload: {
      name: adapter.name(),
      instance: adapter,
    },
  });
}

Promise.all([
  load('./Storage.js', handleStorage),
  load('./adapters/Github.js', handleGithub),
]).then(() => {
  store.dispatch({
    type: 'LOADED',
  });
});


// import('./Storage.js').then(({ default: Storage }) => {
//   var storage = new Storage();
//   console.log(storage.get('hello'));
//   console.log(storage.set('hello', 123));
//   console.log(storage.get('hello'));
// });

// import('./adapters/Github.js').then(({ default: Github }) => {
//   const adapter = new Github();
//   adapter.init({
//     token: 'c42c3570ac892e0942e060839c65e887d9939fc5',
//   });
// });

function b () {
  var gh = new GitHub();
  // console.log(gh);

  gh.getRateLimit().getRateLimit()
    .then((resp) => {
      console.log('Limit remaining: ' + resp.data.rate.remaining);
      console.log('Reset date: ' + new Date(resp.data.rate.reset * 1000));
    }).catch((error) => {
      console.log('Error fetching rate limit', error.message);
    });

  var me = gh.getUser();
  // console.log(me);
  let id;

  me.listGists().then((result) => {
    console.log(result);
    var data = result.data.filter((item) => {
      return item.description === 'homie';
    });

    if (!data.length) {
      // create data
      var gist = gh.getGist();
      var data = {
        public: false,
        description: 'homie',
        files: {
          "bookmarks.txt": {
            content: "a",
          },
          "notes.txt": {
            content: "b",
          },
          "messages.txt": {
            content: "c",
          },
        },
      };
      gist.create(data)
        .then((httpResponse) => {
          console.log(httpResponse);
          var gistJson = httpResponse.data;
          gist.read((err, result) => {
            console.log(err, result, gistJson);
          });
        });
    } else {
      console.log(data);
      id = data[0].id;
    }
  });

  window.onload = () => {
    console.log('ready');
    document.getElementById('message').addEventListener('keydown', (e) => {
      switch (true) {
        case e.keyCode === 13:
          console.log('submit', e.target.value);

          const gist = gh.getGist(id);
          gist.update({
            files: {
              "messages.txt": {
                content: e.target.value,
              },
            },
          }).then(res => {
            console.log('update: ', res);
          });

          break;
      }
    });
  };
}
