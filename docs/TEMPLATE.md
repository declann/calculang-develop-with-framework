<!--
TEMPLATE.md provides:
- collabsible code blocks
- editor
- JS bits: model (obv), calcuvegadata, embed, compile etc.
  -->

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
  <!-- can I collapse things responsively? -->
  <details class="calculang" open><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
  <span style="font-style: italic">editable and dangerous!</span> 🧙‍♂️⚠️
  ${display(editor.dom)}
  <details><summary>javascript ✨</summary>
  <span style="font-style: italic">generated from calculang</span> ⬆️
  ${view(Inputs.textarea({value:esm.code, rows:60, resize: true, disabled:true}))}
  </details>
  <details><summary>dev tools 🧰</summary>
  ${"todo"}
  ${display(Object.keys(introspection))}
  ${display(JSON.stringify([...introspection.cul_links]))}
  </details>
  </details>
  </div>
</div>

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


display(Object.assign(document.createElement('div'), {className: 'hide-empty-block'}))

invalidation.then(() => {console.log(`revoking ${u}`); URL.revokeObjectURL(u)});

```


```js

import { calcuvizspec } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"

import embed from 'npm:vega-embed';

display(Object.assign(document.createElement('div'), {className: 'hide-empty-block'}))

```