function Github (token) {
  import('https://unpkg.com/github-api@3.0.0/dist/GitHub.bundle.min.js').then((a) => {
    console.log('external', a);
  });

  return {
    name: () => 'GitHub',
    auth: () => [{ type: 'text', name: 'token', label: 'Token' }],
    fetch: (type) => {},
    save: (type, data) => {},
  }
}

export default Github;