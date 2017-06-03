function App() {
  function fcodesToJson(text_fcodes) {
    text_fcodes = "&f" + text_fcodes
    let text_json = {}
    let text_split = text_fcodes.match(/([&§][0-9a-fk-or](?:(?![&§][0-9a-fk-or])[\s\S])*)/gi)
    return text_split
    // return text_json
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
  update()
}
window.addEventListener('load', App)
