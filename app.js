function App() {
  const CODES_TO_NAMES = {
    "0": "black",
    "1": "dark_blue",
    "2": "dark_green",
    "3": "dark_aqua",
    "4": "dark_red",
    "5": "dark_purple",
    "6": "gold",
    "7": "gray",
    "8": "dark_gray",
    "9": "blue",
    "a": "green",
    "b": "aqua",
    "c": "red",
    "d": "light_purple",
    "e": "yellow",
    "f": "white",
    "k": "obfuscated",
    "l": "bold",
    "m": "strikethrough",
    "n": "underline",
    "o": "italic"
  }

  function fcodesToJson(text_fcodes) {
    text_fcodes = '&f' + text_fcodes
    text_fcodes = text_fcodes.replace(/[&§]r/gi, '&f')
    let text_split = text_fcodes.match(/([&§][0-9a-fk-o](?:(?![&§][0-9a-fk-o])[\s\S])*)/gi)
    let text_json = []
    text_split.forEach(x => {
      let code = x.charAt(1)
      let text = x.slice(2)
      if (/[0-9a-f]/i.test(code)) {
        let json = {text: text}
        json.color = CODES_TO_NAMES[code]
        text_json.push(json)
      }
      if (/[k-o]/i.test(code)) {
        let json = {text: text}
        json[CODES_TO_NAMES[code]] = true
        // TODO nesting
        text_json.push(json)
      }
    })
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
  update()
}
window.addEventListener('load', App)
