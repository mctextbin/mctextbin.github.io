function App() {
  const FCODES_TO_NAMES = {
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

  const NAMES_TO_FCODES = {
    "black": "0",
    "dark_blue": "1",
    "dark_green": "2",
    "dark_aqua": "3",
    "dark_red": "4",
    "dark_purple": "5",
    "gold": "6",
    "gray": "7",
    "dark_gray": "8",
    "blue": "9",
    "green": "a",
    "aqua": "b",
    "red": "c",
    "light_purple": "d",
    "yellow": "e",
    "white": "f",
    "obfuscated": "k",
    "bold": "l",
    "strikethrough": "m",
    "underline": "n",
    "italic": "o"
  }

  let text_json_record = []

  function downloadTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('hidden', '')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function readTextFile(path, callback) {
    let reader = new FileReader()
    reader.addEventListener('load', event => {
      callback(event.target.result)
    })
    reader.readAsText(path.files[0])
  }

  function storageSave() {
    localStorage.text = document.querySelector('#input').value
  }

  function storageLoad() {
    if (localStorage.text === undefined) {
      localStorage.text = ''
    }
    document.querySelector('#input').value = localStorage.text
  }

  function fcodesToJson(text_fcodes) {
    if (!/^[&§][0-9a-f]/gi.test(text_fcodes)) {
      text_fcodes = `&f${text_fcodes}`
    }
    text_fcodes = text_fcodes.replace(/[&§]r/gi, '&f')
    let text_split = text_fcodes.match(/([&§][0-9a-fk-o](?:(?![&§][0-9a-fk-o])[\s\S])*)/gi)
    let text_json = []
    text_split.forEach(x => {
      let code = x.charAt(1)
      let text = x.slice(2)
      if (/[0-9a-f]/i.test(code)) {
        let json_chunk = {text: text}
        json_chunk.color = FCODES_TO_NAMES[code]
        text_json.push(json_chunk)
      }
      if (/[k-o]/i.test(code)) {
        let json_chunk = {text: text}
        json_chunk[FCODES_TO_NAMES[code]] = true
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
    let text_fcodes = ''
    let nest = function(json_chunk) {
      let text = json_chunk.text
      ;['obfuscated', 'bold', 'strikethrough', 'underline', 'italic'].forEach(x => {
        if (json_chunk[x]) {
          text = `&${NAMES_TO_FCODES[x]}${text}`
        }
      })
      text = `&${NAMES_TO_FCODES[json_chunk.color]}${text}`
      text_fcodes = `${text_fcodes}${text}`
      if (json_chunk.extra) {
        json_chunk.extra.forEach(nest)
      }
    }
    text_json.forEach(nest)
    return text_fcodes
  }

  function escape(text) {
    text = text.replace(`"`, `&quot;`)
    text = text.replace(`&`, `&amp;`)
    text = text.replace(`<`, `&lt;`)
    text = text.replace(`>`, `&gt;`)
    text = text.replace(/ /g, `&nbsp;`)
    text = text.replace(/\n/gi, '<br>')
    return text
  }

  function render(text_json) {
    let nest = function(json_chunk) {
      let rendered_chunk = document.createElement('span')
      rendered_chunk.innerHTML = escape(json_chunk.text)
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

  function importJson(event) {
    readTextFile(event.target, file_text => {
      let text_json = JSON.parse(file_text)
      let text_fcodes = jsonToFcodes(text_json)
      document.querySelector('#input').value = text_fcodes
      update()
    })
  }

  function exportJson() {
    downloadTextFile('mctextbin.json', JSON.stringify(text_json_record))
  }

  function update() {
    storageSave()
    let text_fcodes = document.querySelector('#input').value
    text_json_record = fcodesToJson(text_fcodes)
    render(text_json_record)
  }

  document.querySelector('#input').addEventListener('input', update)
  storageLoad()
  update()
  document.querySelector('#import-json').addEventListener('change', importJson)
  document.querySelector('#export-json').addEventListener('click', exportJson)
}
window.addEventListener('load', App)
