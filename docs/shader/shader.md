---
title: Editable Shader 🧊
toc: false
---

<div class="wrapper">
  <div class="lhs" style="background: lightgreen">
    <div class="grow">
    <h1>ƒ</h1>
    <details class="calculang" open><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
    <span style="font-style: italic">editable!</span> 🧙‍♂️
    <!--<pre class="f">-->${view(Inputs.bind(Inputs.textarea({ rows:60, resize: true}), cul_Input))}<!--</pre>-->
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
    ${view(Inputs.bind(Inputs.range([0,100], {step:1, label:'t_in'}), t_in_Input))}
    </details>
    </div>
  <div class="card" id="viz2"></div>
  <span>for a point (25,25):</span>
  <div class="card" id="viz"></div>
  <div style="visibility:hidden">
  ${resize(width => {
      const result = embed('#viz', calcuvizspec({
    models: [model],
    input_cursors: [{x_in:25,y_in:25, i_in:1}],
    mark: {type:'point', point: false, clip:true},
    encodings: {
      x: { name: 't_in', type: 'quantitative', grid:false, domain: _.range(0,300) },
      y: { name: 'value', type: 'quantitative', grid:false, independent: true},
      row: { name: 'formula', domain: formulae_not_inputs },
      color: { name: 'formula', legend: false }
    },
    width:Math.min(300,width-150), // messy !!! container width works but overstates
    height: 50,
    spec_post_process: spec => {/*spec.width = "container";*/ spec.background='rgba(0,0,0,0)'; return spec}
  }))
  return result
    })
  }
  ${resize(width => {
      const result = embed('#viz2', calcuvizspec({
    models: [model],
    input_cursors: [{t_in}],
    mark: {type:'rect', point: false, clip:true},
    encodings: {
      x: { name: 'x_in', type: 'nominal', grid:false, domain: _.range(0,50) },
      y: { name: 'y_in', type: 'nominal', grid:false, domain: _.range(0,50) },
      row: { name: 'formula', domain: formulae_not_inputs },
      color: { name: 'value', type: 'quantitative', legend: true, independent: true }
    },
    width:Math.min(300,width-200), // messy !!! container width works but overstates
    height: 150,
    spec_post_process: spec => {/*spec.width = "container";*/ spec.background='rgba(0,0,0,0)'; return spec}
  }))
  return result
    })
  }
  </div>
  </div>
</div>


```js

const esm = compileWithMemo(cul).code
const introspection = introspection2(cul)
//display(introspection.cul_input_map) todo put under devtools
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

const cul_default = await FileAttachment('./shader.cul.js').text()

import { calcuvizspec } from "../components/helpers.js"

import { compile, introspection2, compileWithMemo } from "../components/mini-calculang.js"
```


```js
import embed from 'npm:vega-embed';

const t_in_Input = Inputs.input(3);
const t_in = Generators.input(t_in_Input);
const radius_in_Input = Inputs.input(7);
const radius_in = Generators.input(radius_in_Input);

const toggle_Input = Inputs.input("cul");
const toggle = Generators.input(toggle_Input);

// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);

```

```js
// from https://observablehq.com/framework/lib/vega-lite
// because embed doesn't work? (=> no tooltips)
/*import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);*/
```
