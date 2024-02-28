---
title: Editable Game of Life
toc: false
---

```js
const workbook = await FileAttachment('./game-of-life.xlsx').xlsx()

const size_in = 24

//display(workbook)
//display(Object.values(workbook.sheet("Sheet1")[0]))
```

```js
import {editor as editorCm, config as eslintConfig} from './editor.bundle.js'



const start_doc = cul_default

const doc = Mutable(start_doc) // I still have doc Input below, remove?

const editor = editorCm({doc: start_doc, update: update => {doc.value = update.state.doc.toString();}})



```

```js
const initial_grid_in0 = _.range(0,50).map(d => Object.values(workbook.sheet("Sheet1")[d]))
const initial_grid_function_in = () => initial_grid_in0//({x_in,y_in}) => initial_grid_in0[y_in][x_in]
```

```js
//_.range(0,g_in).map(d => calcudata({models:[model], input_domains:{x_in:_.range(0,15), y_in: _.range(0,15)}, outputs: ['alive'], input_cursors:[{size_in:15, initial_grid_in, g_in:d}]}));
  //  console.log('end')

```

<div class="wrapper">
  <div class="lhs" style="background: lightgreen">
    <div class="grow">
    <h1>ƒ</h1>
    <!-- can I collapse things responsively? -->
    <details class="calculang"><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
    <span style="font-style: italic">editable and dangerous!</span> 🧙‍♂️⚠️
    ${display(editor.dom)}
    <!--<pre class="f">${view(Inputs.bind(Inputs.textarea({ rows:60, resize: true}), cul_Input))}</pre>-->
    <details><summary>javascript ✨</summary>
    <span style="font-style: italic">generated from calculang</span> ⬆️
    ${view(Inputs.textarea({value:esm,  rows:60, resize: true, disabled:true}))}
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
    ${view(Inputs.bind(Inputs.range([0,200], {step:1, label:'generation'}), g_in_Input))}
    </details>
    </div>
  <div class="card" id="viz"></div>
  <details><summary>Performance notes</summary>
  <ul><li>initial grid as a function input is very important to take stress off naive memo with JSON stringify hash</li>
  <li>at 50x50, rendering appears a bottleneck; bypass calcudata? (object structure poor)</li>
  <li>stream data to vega, or render to canvas or css grid? (with animation?) (somehow vega svg faster than vega canvas and I think FF faster than chromium)</li>
  <li>memory usage is out of control: manually try memo eviction strategies</li></ul></details>
  <div style="visibility:hidden">
  ${resize(width => {
      const result = embed('#viz', calcuvizspec({
    models: [model],
    input_cursors: [{size_in, initial_grid_function_in, g_in}],
    mark: {type:'point', point: false, filled: true, tooltip:false},
    encodings: {
      x: { name: 'x_in', type: 'ordinal', grid:false, domain: _.range(0,size_in) },
      y: { name: 'y_in', type: 'ordinal', grid:false, domain: _.range(0,size_in) },
      //row: { name: 'formula', domain: formulae_not_inputs },
      color: { name: 'alive', legend: true }
    },
    width:180, //Math.min(300,width-150), // messy !!! container width works but overstates
    height: 180,
    spec_post_process: spec => {/*spec.width = "container";*/ spec.background='rgba(0,0,0,0)';
    spec.encoding.shape = {value:'square'}; return spec}
  }), { renderer: 'svg'})
  return result
    })
  }
  </div>
  </div>
</div>


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

const cul_default = await FileAttachment('./cul/game-of-life.cul.js').text()

import { calcuvizspec, calcudata } from "../components/helpers.js"

import { compile, introspection2, compileWithMemo } from "../components/mini-calculang.js"
```


```js
import embed from 'npm:vega-embed';

const n_in_Input = Inputs.input(8);
const n_in = Generators.input(n_in_Input);
const g_in_Input = Inputs.input(0);
const g_in = Generators.input(g_in_Input);



```

```js
// from https://observablehq.com/framework/lib/vega-lite
// because embed doesn't work? (=> no tooltips)
/*import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);*/
```