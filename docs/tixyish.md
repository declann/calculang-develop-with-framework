---
title: tixy-ish 🎨
toc: false
---

```js
import {Scrubber} from './components/scrubber.js'

import * as lineColumn from 'npm:line-column';

import { SourceMapConsumer } from 'npm:source-map-js';
```

# tixy-ish

Inspired by [tixy.land](https://twitter.com/aemkei/status/1323399877611708416); in development; [open to contributions](https://github.com/declann/calculang-develop-with-framework/docs/tixyish.md)!

```js
import {editor as editorCm, config as eslintConfig} from './graphing-calcs/editor.bundle.js'

import {calcuvegadata} from './components/calcuvegadata.js'

const start_doc = cul_default

const doc = Mutable(start_doc) // I still have doc Input below, remove?

const selection = Mutable({from:{line:7,column:23}, to:{line:7,column:65}})

const editor = editorCm({doc: start_doc, update: update => {doc.value = update.state.doc.toString();}, updateSelection: s => {selection.value = s}})
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
  <div class="rhs" style="background: pink">
    <h1>🎨</h1>
    <div class="card">
    <details open><summary>inputs ⚙️</summary>
    ${view(Inputs.bind(Scrubber(_.range(0,8,1/20), {delay: 1000/20, autoplay: true, alternate:true, format:d => d3.format('.2f')(d)}), t_in_Input))}
    <!--${/*view(Inputs.bind(Inputs.range([0,8], {step:0.1}), t_in_Input))*/t_in}-->
    </details>
    </div>
  <div class="card" id="viz"></div>
  <h3>eval-on-select (select formula text, then activate with F8)</h3>
  <div class="card" id="viz2"></div>
  <details open><summary>compiled selection (via sourcemap)</summary>
  <pre>${display(selection_esm)}</pre></details> <!-- editing html breaks my visuals -->
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

## visual 1 (main output, with mouse interactivity)

```js echo
const spec = ({
  // vega-lite
  title: "v",
  mark: {type:'point', point: false, filled: true},
  encoding: {
    x: { field: 'x_in', type: 'quantitative', domain: _.range(0,size_in), scale: {nice:false, domain:[-1,16]} },
    y: { field: 'y_in', type: 'quantitative', domain: _.range(0,size_in), sort:'descending', scale: {nice:false, domain:[-1,16]} },
    size: { field: 'abs_v_clamped', type: 'quantitative', scale: {domain:[0,1]} },
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
  models: [model],
  spec,
  domains: {
    x_in: _.range(0,size_in),
    y_in: _.range(0,size_in)
  },
  input_cursors: [
    { t_in, mousex_in, mousey_in, random_seed_in }
  ]
})
```

```js echo
viz.view.data("data", data_source)/*.resize()*/.run(); // turn off resize
```

```js echo
const random_seed_in = 'x' // reactive issues if mixed in mutable updates blocks
```

```js echo
const mousex_in = Mutable(8)
const mousey_in = Mutable(8)

viz.view.addSignalListener('mousex', a => {
  console.log('mousex', a)
  mousex_in.value = viz.view.signal('mousex')
})
viz.view.addSignalListener('mousey', a => {
  mousey_in.value = viz.view.signal('mousey')
})
```

---

## visual 2
 

```js echo
const spec2 = ({
  // vega-lite
  title: "selection",
  mark: {type:'text', point: false, filled: true},
  encoding: {
    x: { field: 'x_in', type: 'quantitative', scale: {nice:false, domain:[-1,16]} },
    y: { field: 'y_in', type: 'quantitative', sort:'descending', scale: {nice:false, domain:[-1,16]} },
    text: { field: 'selection_fn', format: ('.1f') },
    color: { field: 'selection_fn', type: 'quantitative', legend: false/*, scale: {domain:[0,1] }*/}
  },
  data: { name: "data" },
  datasets: {
    data: [],
  },
  autosize: { "type": "fit", "contains": "padding"},
  width: Math.min(500,rhs_width-30),
  height: 300,
  background:'rgba(0,0,0,0)'
})

const viz2 = embed('#viz2', spec2)
```

```js echo
const data_source2 = calcuvegadata({
  models: [{selection_fn: (a) => selection_fn(model,a)}],
  spec: spec2,
  domains: {
    x_in: _.range(0,size_in),
    y_in: _.range(0,size_in)
  },
  input_cursors: [
    { t_in, mousex_in, mousey_in, random_seed_in }
  ]
})
```

```js echo
viz2.view.data("data", data_source2)/*.resize()*/.run(); // turn off resize
```

---

```js echo
const size_in = 16

const t_in_Input = Inputs.input(0);
const t_in = Generators.input(t_in_Input);

const rhs_width = Generators.width(document.querySelector(".rhs")); // keep as a generator for reactivity
```

```js

const esm = compileWithMemo(doc)
const introspection = introspection2(doc)
//display(introspection.cul_input_map)
//display(introspection)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

//display(Object.values(introspection.cul_functions))
//display([...introspection.cul_functions.values()])

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)
//display(formulae_not_inputs)


const model = await import(URL.createObjectURL(new Blob([esm.code], { type: "text/javascript" })).toString())

//display(model)


```


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/tixy.cul.js').text()

import { calcuvizspec, calcudata } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"
```


```js
import embed_ from 'npm:vega-embed';

const embed = (a,b,options) => embed_(a,b, {renderer:'svg', ...options});
```

---

eval-on-select

```js
const sourcemap = new SourceMapConsumer(esm.map)

const selection_start = sourcemap.generatedPositionFor({...selection.from, source:"unknown"})
const selection_end = sourcemap.generatedPositionFor({...selection.to, source:"unknown"})

const esm_split = esm.code.split('\n')

display(selection_start)
display(selection_end)
```

```js
const selection_esm = esm.code.slice(index_start+1,index_end+1)
```

```js
const index_start =lineColumn.default(esm.code).toIndex(selection_start)
const index_end =lineColumn.default(esm.code).toIndex(selection_end)

display("selection:")
display(selection)
```

```js echo
// all inputs must be maintianed here to pass to selection function

const ins = ({x_in: 8, y_in:8, t_in, random_seed_in, mousex_in, mousey_in})
```

```js

//const x_in = 3;


const exec = selection_esm

//const exec_f = new Function("model", "x_in", `return ${exec}`)(model, x_in)

//display(exec_f) // Works

//display(new Function("model", "{x_in,y_in}", `window.bb = 10; return bb+x_in+y_in`)(model, ins)) // works


// super dangerous and insecure window assignment here but trying as alt to manual replacement; for manual replacement see reactive workings
// TOFIX when i integrate reactive workings
const selection_fn = new Function("model", "{"+Object.keys(ins).join(",")+"}", `Object.assign(window, model); return ${exec}`)

display(selection_fn(model, ins))


//display(new Function("model", "{x_in,y_in}", `return x_in+y_in`)(model, ins)) // works


//display(bb)

```

todo maintain eval selection range with edits? Alt.: don't react to edits by freezing into Mutable, but this is poor.
and multi-selection (concatenating useful imo)