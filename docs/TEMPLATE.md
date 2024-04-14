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
  return {...d, ...selection_fn(model, cursor)}
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

        dd.v = selection_fn(model,cursor)

        return dd //return selection_fn(model, c)
      })
```

```js
// wrap echoed source code by details tag; hot reload breaks this but ok for now
document.querySelectorAll('.observablehq-pre-container').forEach(el => {
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

const editor = editorCm({doc: start_doc, update: update => {doc.value = update.state.doc.toString();}})
```

<div id="wrapper" class="wrapper">
<div id="lhs" class="lhs side">
  <div class="grow">
  <h1>ƒ</h1>
  <!-- can I collapse things responsively? check sidebar code in client.js and styling -->
  <details class="calculang" open><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
  <span style="font-style: italic">editable and dangerous!</span> 🧙‍♂️⚠️
  ${display(editor.dom)}
  <details><summary>javascript ✨</summary>
  <span style="font-style: italic">generated from calculang</span> ⬆️
  ${view(Inputs.textarea({value:esm.code, rows:60, resize: true, disabled:true}))}
  </details>
  <details open><summary>dev tools 🧰</summary>

*reactive workings (todo):*

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

```js
display(calls_annotations)
display(fns_annotations.map(d => d.v))
display(introspection)
```

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

import { calcuvizspec } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"

import embed from 'npm:vega-embed';

//display(Object.assign(document.createElement('div'), {className: 'hide-empty-block'}))

```

</div>
