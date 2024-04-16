<!--
TEMPLATE.md provides:
- collabsible code blocks
- editor
- JS bits: model (obv), calcuvegadata, embed, compile etc.
  -->

```js
import { SourceMapConsumer } from 'npm:source-map-js';

const map = new SourceMapConsumer(esm.map);

const cul_scope_id = 0

const calls_annotations = 
  [...introspection.cul_links].filter(d => d.reason == 'call')
        .map((d) => ({
        ...d,
        mjs_loc: {
          start: map.generatedPositionFor({
            ...d.loc.start,
            source: esm.map.sources[0] //`${only_entrypoint_no_cul_js}-nomemo.cul.js` // todo update !
          }),
          end: map.generatedPositionFor({
            ...d.loc.end,
            source: esm.map.sources[0] //`${only_entrypoint_no_cul_js}-nomemo.cul.js`
          })
        }
      }))
      .map((d) => ({
        ...d,
        mjs: esm.code
          .split("\n")
        [d.mjs_loc.start.line - 1].substring(
          d.mjs_loc.start.column,
          d.mjs_loc.end.column
        )
      })) // assuming completely on one line
      .map(d => {
  const selection_fn = new Function("model", "{"+Object.keys(cursor).join(",")+"}", `Object.assign(window, model); return ({value:${d.mjs}, cursor: ${d.mjs.slice(d.from.length-2)}})`) // using hacky way to get cursor, for calculang-at-fosdem I used babel: `is` function
  return {...d, ...selection_fn(model, cursor2)}
})

const fns_annotations = [...introspection.cul_functions.values()].filter(
        (d) =>
          d.reason == "definition" /*input definition doesn't have a loc*/ &&
          d.cul_scope_id == cul_scope_id
      )
      .map(d => {
        const dd = {...d}
        dd.inputs = [...introspection.cul_input_map['0_'+d.name]]

        const selection_fn = new Function("model", "{"+dd.inputs.join(",")+"}", `Object.assign(window, model); return ${d.name}({${dd.inputs.join(",")}})`)

        dd.v = selection_fn(model, cursor2)

        return dd //return selection_fn(model, c)
      })
```

```js



const selection_start = map.generatedPositionFor({...selection.from, source:"unknown"})
const selection_end = map.generatedPositionFor({...selection.to, source:"unknown"})

const esm_split = esm.code.split('\n')
```

```js
// wrap echoed source code by details tag; hot reload breaks this but ok for now
document.querySelectorAll('.observablehq-pre-container:has(> pre[data-language="js"])').forEach(el => {
  let wrapper = document.createElement('details');
  wrapper.className = 'code'
  let summary = document.createElement('summary')
  summary.textContent = "code 👀"
  wrapper.appendChild(summary)
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
});

//document.getElementById('wrapper').insertBefore(document.getElementById('lhs'),document.getElementById('content'));

/*document.querySelectorAll('div.observablehq--block').forEach(div => {
  if (div.innerHTML === '') div.remove();
})*/

// above dom manips all cause new els on hot reload..
```

```js


import {editor as editorCm, config as eslintConfig} from './graphing-calcs/editor.bundle.js'

import {calcuvegadata} from './components/calcuvegadata.js'


const start_doc = cul_default

const doc = Mutable(start_doc) // I still have doc Input below, remove?

const selection = Mutable({from:{line:1,column:1}, to:{line:1,column:2}})

const editor = editorCm({doc: start_doc, update: update => {doc.value = update.state.doc.toString();}, updateSelection: s => {selection.value = s}})
```

<div id="wrapper" class="wrapper">
<div id="lhs" class="lhs side">
  <div class="grow">
  <h1>ƒ</h1>
  <!-- can I collapse things responsively? check sidebar code in client.js and styling -->
  <details class="calculang" open><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
  <span style="font-style: italic">editable and dangerous!</span> 🧙‍♂️⚠️
  ${display(editor.dom)}
  <details open><summary>dev tools 🧰</summary>

```js
display(inputs_ui)
```


```js
import * as marked from 'npm:marked'

const e = document.createElement('div')
e.innerHTML = marked.parse(function_inputs_table(introspection))

display(e)

function_inputs_table(introspection)
```


```js
// for F9, not sure if I want to include? Or replace with optional markers?
// Or put in a panel?
// Do selection eval? (like in tixy)
import * as lineColumn from 'npm:line-column';
const index_start =lineColumn.default(esm.code).toIndex(selection_start)
const index_end =lineColumn.default(esm.code).toIndex(selection_end)

const selection_esm = esm.code.slice(index_start+1,index_end+1)

```

#### select-F9 🧙‍♂️ javascript

<pre style="font-size:0.5em">
${selection_esm} <!-- editing html breaks my visuals -->
</pre>

```js
const cursor = Mutable({}) // every input should be in, but with what values?

const setCursor = (k,v) => {
  cursor.value = {...cursor.value, [k]:v};
}
```

```js
const formula = Mutable("")

const setFormula = (v) => {
  formula.value = v
}
```

<details><summary>reactive workings</summary>

```js
display(calls_annotations)
display(fns_annotations.map(d => d.v))
display(introspection)
```

</details>

  </details>

<details><summary style="font-size:1em">complete javascript ✨</summary>
  <span style="font-style: italic">generated from calculang</span> ⬆️
  ${view(Inputs.textarea({value:esm.code, rows:60, resize: true, disabled:true}))}
  </details>


  </details>
  </div>
</div>

<div style="display:none">

```js

const esm = compileWithMemo(doc)
const introspection = introspection2(doc)
//display(introspection.cul_input_map) todo put under devtools
//display(introspection)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

//display(Object.values(introspection.cul_functions))
//display([...introspection.cul_functions.values()])

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)
//display(formulae_not_inputs)


const u = URL.createObjectURL(new Blob([esm.code], { type: "text/javascript" }))
console.log(`creating ${u}`)

const model = await import(u)


//display(Object.assign(document.createElement('div'), {className: 'hide-empty-block'}))

invalidation.then(() => {console.log(`revoking ${u}`); URL.revokeObjectURL(u)});

```


```js

import { calcuvizspec, function_inputs_table, graph_functions } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"

import embed from 'npm:vega-embed';

//display(Object.assign(document.createElement('div'), {className: 'hide-empty-block'}))

```

REACTIVE FORMULAS:

```js
// page needs to provide excludes
const dependencies = inputs.filter(d => !excludes.includes(d))


```

```js
fns_annotations.forEach(d => {
  if (document.getElementById(d.name))
  document.getElementById(d.name).innerHTML = d3.format(',.2f')(d.v) + "<div class='cm-tooltip-arrow' />"
});
```

REACTIVE INPUTS:


```js
document.querySelectorAll('.inputs .flash').forEach(d => d.remove())
inputs_ui.dataset.inputs = '' // up ran first? so use fake to control order:
const fake = ''
```

```js
const inputs_ui = document.createElement('div')
inputs_ui.className = 'inputs'
```

```js
console.log("don't repeat")

const extra_cursor_Input = Inputs.input({})
const extra_cursor = Generators.input(extra_cursor_Input)
```

```js
const cursor2 = ({...cursor, ...extra_cursor})
```

```js
fake;
//extra_cursor; // need to react to changes to cursor
up(inputs_ui, extra_cursor_Input, dependencies, model, {}); // must keep minibinds sep. to pick up updates
// because needs to detect removal for flash (above)
```


</div>


