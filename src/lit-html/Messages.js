import { html } from 'https://unpkg.com/lit-html?module'

const Message = (message) => {
  return html `
    <style>
      .message {
        padding: 10px;
        border: 1px solid #aaa;
      }
    </style>
    <div class="message">
      <div>${message.id}</div>
      <div>${message.content}</div>
    </div>
  `
}

const handleSubmit = (e) => {
  e.preventDefault()
  const content = e.target.children.content
  if (content.value) {
    store.dispatch({
      type: 'ADD_MESSAGE',
      payload: content.value,
    })
  }
  content.value = ''
}

const Messages = () => {
  return html `
    <div>
      <form
        @submit=${handleSubmit}
        autocomplete="off"
      >
        <input
          type="text"
          name="content"
        />
      </form>
      ${store.get('messages').map(Message)}
    </div>
  `
}

export default Messages
