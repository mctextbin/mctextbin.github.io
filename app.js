function App() {
  const FCODE_NAMES = {
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

  function storage_save() {
    localStorage.text = document.querySelector('#input').value
  }

  function storage_load() {
    if (localStorage.text === undefined) {
      localStorage.text = ''
    }
    document.querySelector('#input').value = localStorage.text
  }

  function fcodesToJson(text_fcodes) {
    text_fcodes = `&f${text_fcodes}`
    text_fcodes = text_fcodes.replace(/[&§]r/gi, '&f')
    let text_split = text_fcodes.match(/([&§][0-9a-fk-o](?:(?![&§][0-9a-fk-o])[\s\S])*)/gi)
    let text_json = []
    text_split.forEach(x => {
      let code = x.charAt(1)
      let text = x.slice(2)
      if (/[0-9a-f]/i.test(code)) {
        let json_chunk = {text: text}
        json_chunk.color = FCODE_NAMES[code]
        text_json.push(json_chunk)
      }
      if (/[k-o]/i.test(code)) {
        let json_chunk = {text: text}
        json_chunk[FCODE_NAMES[code]] = true
        let nest = function(text_chunk) {
          if (text_chunk.extra) {
            nest(text_chunk.extra[text_chunk.extra.length - 1])
          } else {
            text_chunk.extra = [json_chunk]
          }
        }
        nest(text_json[text_json.length - 1])
      }
    })
    return text_json
  }

  function jsonToFcodes(text_json) {
    let text_fcodes = text_json
    return text_fcodes
  }

  function render(text_json) {
    let nest = function(json_chunk) {
      let rendered_chunk = document.createElement('span')
      rendered_chunk.innerHTML = json_chunk.text
      rendered_chunk.classList.add(`formatting-${json_chunk.color}`)
      ;['obfuscated', 'bold', 'strikethrough', 'underline', 'italic'].forEach(x => {
        if (json_chunk[x]) {
          rendered_chunk.classList.add(`formatting-${x}`)
        }
      })
      this.appendChild(rendered_chunk)
      if (json_chunk.extra) {
        json_chunk.extra.forEach(nest, rendered_chunk)
      }
    }
    let parent = document.querySelector('#output')
    parent.innerHTML = ''
    text_json.forEach(nest, parent)
  }

  function update() {
    storage_save()
    let text_fcodes = document.querySelector('#input').value
    let text_json = fcodesToJson(text_fcodes)
    render(text_json)
  }

  document.querySelector('#input').addEventListener('input', update)
  storage_load()
  update()
}
window.addEventListener('load', App)
