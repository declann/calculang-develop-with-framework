---
title: Graphing Dash 🏃 wip 🚧 Grid version
toc: false
---

# Graphing Dash 🏃 🚧 Grid version

<style>
#observablehq-main {
  max-width: 2000px;
}
</style>

<div class="grid grid-cols-2" style="grid-auto-rows: auto; gap: 0.5rem">
  <div class="grid-rowspan-2 card" style="background: lightgreen">
    <h1>calculang</h1>
    <!-- can I collapse things responsively? -->
    <details open><summary>f(x) ✍️</summary>
    <pre>
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
f(x)
(and pre gets mashed by Framework if I leave breaks?)</pre>
    </details>
  </div>
  <div class="card" style="background: pink">
    <details open><summary>inputs ⚙️</summary>
    ${view(Inputs.bind(Inputs.range([0,20], {step:0.1, value:8, label:'n_in'}), n_in_Input))}
    ${view(Inputs.bind(Inputs.range([0,20], {step:0.1, value:7, label:'radius_in'}), radius_in_Input))}
    </details>
  </div>
  <div class="card" style="background: pink">
    <p style="color:brown">calcd width=${width} is far too big; using 200px:</p>
    ${vl.render({
  spec: calcuvizspec({
    models: [model],
    input_cursors: [{n_in:n_in, radius_in}],
    mark: {type:'line', point: false},
    encodings: {
      x: { name: 'x_in', type: 'quantitative', domain: _.range(-10,10,0.01) },
      y: { name: 'value', type: 'quantitative' },
      row: { name: 'formula', domain: formulae_not_inputs },
      color: { name: 'formula', legend: false }
    },
    width: 200,
    height: 50
  })
})}
  </div>
</div>


```js
//display=false
import * as model from './cul/calcs_esm/cul_scope_0.js'
import {FileAttachment} from "npm:@observablehq/stdlib";

const introspection = await FileAttachment('./cul/calcs.introspection.json').json()

const inputs = Object.values(introspection.cul_functions).filter(d => d.reason == 'input definition').map(d => d.name).sort()

const formulae_not_inputs = Object.values(introspection.cul_functions).filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)

//display(introspection)

//display(model)

import { calcuvizspec } from "../components/helpers.js"
```


```js
const n_in_Input = Inputs.input(8);
const n_in = Generators.input(n_in_Input);
const radius_in_Input = Inputs.input(7);
const radius_in = Generators.input(radius_in_Input);
```

```js
// from https://observablehq.com/framework/lib/vega-lite
// because embed doesn't work? (=> no tooltips)
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);
```