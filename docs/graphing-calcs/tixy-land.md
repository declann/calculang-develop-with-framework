---
title: tixy.land clone (poc)
toc: false
---

```js
import {Scrubber} from '../components/scrubber.js'
```

Inspired by [tixy.land](https://twitter.com/aemkei/status/1323399877611708416); in development.

```js
import {editor as editorCm, config as eslintConfig} from './editor.bundle.js'

import {calcuvegadata} from '../components/calcuvegadata.js'

const start_doc = cul_default

const doc = Mutable(start_doc) // I still have doc Input below, remove?

const selection = Mutable("")

const editor = editorCm({doc: start_doc, update: update => {doc.value = update.state.doc.toString();}, updateSelection: s => {selection.value = s}})
```

select+F8=

```js
selection
```

TODO map to calculang compiled code and reactively update

```js
//_.range(0,t_in).map(d => calcudata({models:[model], input_domains:{x_in:_.range(0,15), y_in: _.range(0,15)}, outputs: ['alive'], input_cursors:[{size_in:15, initial_grid_in, t_in:d}]}));
  //  console.log('end')

```

<div class="wrapper">
  <div class="lhs" style="background: lightgreen">
    <div class="grow">
    <h1>ƒ</h1>
    <!-- can I collapse things responsively? -->
    <details class="calculang" open><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
    <span style="font-style: italic">editable and dangerous!</span> 🧙‍♂️⚠️
    ${display(editor.dom)}
    <details><summary>javascript ✨</summary>
    <span style="font-style: italic">generated from calculang</span> ⬆️
    ${view(Inputs.textarea({value:esm, rows:60, resize: true, disabled:true}))}
    </details>
    <details><summary>dev tools 🧰</summary>
    ${"todo"}
    </details>
    </details>
    </div>
  </div>
  <div class="rhs" style="background: pink">
    <h1>🎨</h1>
    <div class="card">
    <details open><summary>inputs ⚙️</summary>
    ${view(Inputs.bind(Scrubber(_.range(0,20,1/20), {delay: 1000/20, autoplay: false, format:d => d3.format('.2f')(d)}), t_in_Input))}
    </details>
    </div>
  <div class="card" id="viz"></div>
  <div class="card" id="viz2"></div>
  </div>
</div>



<br/>
<br/>
<br/>
<br/>
<br/>
<br/>


---


## appendix & source code of 🎨

*showing selected source code of 🎨*

For complete source see [GitHub](https://github.com/declann/calculang-develop-with-framework/tree/dev).

<details><summary>notes</summary>this is Javascript and using tools and patterns that I repeat, but remember that calculang is unopinionated!<br />
calculang/output is also highly portable and uniform.</details>

---

## visual 1 (main output)

```js echo
const spec = ({
  // vega-lite
  mark: {type:'point', point: false, filled: true},
  encoding: {
    x: { field: 'x_in', type: 'quantitative', domain: _.range(0,size_in), scale: {nice:false, domain:[-1,16]} },
    y: { field: 'y_in', type: 'quantitative', domain: _.range(0,size_in), sort:'descending', scale: {nice:false, domain:[-1,16]} },
    size: { field: 'v_clamped', type: 'quantitative', scale: {domain:[0,1]} },
    //color: {value: 'red'}
    color: { field: 'positive', type: 'nominal', scale: {domain:[false, true], range: ['orange','red'] }}, // todo color calcd from model?
    shape: { field: 'positive', type: 'nominal', scale: {domain:[false, true], range: ['diamond','circle'] }} // todo color calcd from model?
  },
  data: { name: "data" },
  datasets: {
    data: [],
  },
  autosize: { "type": "fit", "contains": "padding"},
  width: Math.min(400,rhs_width-30),
  height: 300,
  background:'rgba(0,0,0,0)'
})

// interactivity via vega signals and listeners
const viz = embed('#viz', spec, {patch: [{
  path: "/signals",
  op: "add",
  value: [{
    name: "mousex",
    value: 8,
    on: [
      {"events": "mousemove{30}", "update": (size_in-1)+"*x()/range('x')[1]"}
    ]
  },{
    name: "mousey",
    value: 8,
    on: [
      {"events": "mousemove{30}", "update": (size_in-1)+"*y()/range('y')[1]"}
    ]
  }]
}]})
```

```js echo
const data_source = calcuvegadata({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  models: [model],
  spec,
  domains: {
    x_in: _.range(0,size_in),
    y_in: _.range(0,size_in)
  },
  input_cursors: [
    { t_in, mousex_in, mousey_in, random_seed_in:'x' }
  ]
})
```

```js echo
viz.view.data("data", data_source)/*.resize()*/.run();
```

```js echo
const mousex_in = Mutable(8)
const mousey_in = Mutable(8)

viz.view.addSignalListener('mousex', a => {
  console.log('mousex', viz.view.signal('mousex'))
  mousex_in.value = viz.view.signal('mousex')
})
viz.view.addSignalListener('mousey', a => {
  console.log('mousey', viz.view.signal('mousey'))
  mousey_in.value = viz.view.signal('mousey')
})
```

---

## visual 2
 
Using `calcuvizspec`: more ergonomic dx but performance poor for interactivity:

```js echo
const viz2 = embed('#viz2', calcuvizspec({
  models: [model],
  input_cursors: [{t_in, mousex_in, mousey_in}],
  mark: {type:'text', point: false, filled: true},
  encodings: {
    x: { name: 'x_in', type: 'ordinal', domain: _.range(0,size_in) },
    y: { name: 'y_in', type: 'ordinal', domain: _.range(0,size_in) },
    text: { name: 'v', format: ('.1f') },
    color: { name: 'v', type: 'quantitative', legend: false }
  },
  width: Math.min(400-30,rhs_width-30),
  height: 300,
  spec_post_process: spec => { spec.autosize = { "type": "fit", "contains": "padding"};
    spec.background='rgba(0,0,0,0)'; return spec }
}))
```


```js echo
const size_in = 16

const t_in_Input = Inputs.input(0);
const t_in = Generators.input(t_in_Input);

const rhs_width = Generators.width(document.querySelector(".rhs")); // keep as a generator for reactivity
```

```js

const esm = compileWithMemo(doc).code
const introspection = introspection2(doc)
//display(introspection.cul_input_map)
//display(introspection)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

//display(Object.values(introspection.cul_functions))
//display([...introspection.cul_functions.values()])

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)
//display(formulae_not_inputs)


const model = await import(URL.createObjectURL(new Blob([esm], { type: "text/javascript" })).toString())

//display(model)


```


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/tixy.cul.js').text()

import { calcuvizspec, calcudata } from "../components/helpers.js"

import { compile, introspection2, compileWithMemo } from "../components/mini-calculang.js"
```


```js
import embed_ from 'npm:vega-embed';

const embed = (a,b,options) => embed_(a,b, {renderer:'svg', ...options});
```