function Github () {
  const name = () => 'GitHub'
  const init = () => {
    return new Promise((resolve) => {
      import('https://unpkg.com/github-api@3.0.0/dist/GitHub.bundle.min.js').then(() => {
        resolve()
      })
    })
  }
  const auth = () => [{ type: 'text', name: 'token', label: 'Token' }]
  const fetch = (type) => {}
  const save = (type, data) => {}

  return {
    name,
    init,
    auth,
    fetch,
    save,
  }
}

export default Github