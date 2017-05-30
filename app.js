function App() {
  function fcodesToJson(text_fcodes) {
    let text_json = text_fcodes
    return text_json
  }

  function jsonToFcodes(text_json) {
    let text_fcodes = text_json
    return text_fcodes
  }

  function render(text_json) {
    let text_rendered = JSON.stringify(text_json)
    document.querySelector('#output').innerHTML = text_rendered
  }

  function update() {
    let text_fcodes = document.querySelector('#input').value
    let text_json = fcodesToJson(text_fcodes)
    render(text_json)
  }
  document.querySelector('#input').addEventListener('input', update)
}
window.addEventListener('load', App)
