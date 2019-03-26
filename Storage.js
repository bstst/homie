function Storage () {
  const get = (key) => {
    return JSON.parse(window.localStorage.getItem(key));
  };
  const set = (key, value) => {
    return window.localStorage.setItem(key, JSON.stringify(value));
  };
  const add = (key, value) => {
    const items = get(key) || [];
    if (items.indexOf(value) === -1) {
      items.push(value);
    }
    return set(key, items);
  };
  const remove = (key, value) => {
    const items = get(key) || [];
    return set(key, items.filter(item => item !== value));
  }
  const clear = () => {
    return window.localStorage.clear();
  };
  return {
    get,
    set,
    add,
    remove,
    clear,
  };
}

export default Storage;
