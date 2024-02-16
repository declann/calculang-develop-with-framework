---
title: Graphing Dash 🏃
toc: false
---

<style>
#observablehq-main {
  max-width: 2000px;
}

#observablehq-center {
  margin: 0.8rem;
}

pre {
  white-space: pre-wrap;
}

label {
  font-weight: bold;
}

/*details[open] > summary.calculang {
  background: #aaa4;
  border: 1px dotted orange;
}*/

details > summary.calculang {
  border: 1px dashed orange;
  background: #aaa4;
}

details > summary {
  font-weight: bold;
}

.wrapper {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.observablehq-pre-container {
  margin: 1rem 0; /* -1rem -> 0 */
}

.wrapper > div {
  padding: 0.5rem;
  /*max-height:50vh;*/
  border-radius: 20px;

  height: fit-content;
}

.lhs, .rhs {
  display: flex;
  flex-flow: column;
}


.grow {
  flex-grow: 1;
  min-height: 100px;
}

.f {
  max-height: 60vh;
  min-height: 100px;
}

</style>

<div class="wrapper">
  <div class="lhs" style="background: lightgreen">
    <div class="grow">
    <h1>ƒ</h1>
    <!-- can I collapse things responsively? -->
    <details><summary class="calculang">calculang ✍️</summary>
    <pre class="f">${toggle == 'cul' ? cul : esm}</pre>${view(Inputs.bind(Inputs.radio(new Map([["calculang ✍️", "cul"], ["javascript ✨","js"]]), {value:"cul"}), toggle_Input))}
    </details>
    </div>
  </div>
  <div class="rhs" style="background: pink">
    <h1>🎨</h1>
    <div class="card">
    <details open><summary>inputs ⚙️</summary>
    ${view(Inputs.bind(Inputs.range([0,20], {step:0.1, value:8, label:'n_in'}), n_in_Input))}
    ${view(Inputs.bind(Inputs.range([0,20], {step:0.1, value:7, label:'radius_in'}), radius_in_Input))}
    </details>
    </div>
  <div class="card" id="viz"></div>
  <div style="visibility:hidden">
  ${resize(width => {
      const result = embed('#viz', calcuvizspec({
    models: [model],
    input_cursors: [{n_in:n_in, radius_in}],
    mark: {type:'line', point: false},
    encodings: {
      x: { name: 'x_in', type: 'quantitative', domain: _.range(-10,10,0.01) },
      y: { name: 'value', type: 'quantitative' },
      row: { name: 'formula', domain: formulae_not_inputs },
      color: { name: 'formula', legend: false }
    },
    width:width-150, // messy !!! container width works but overstates
    height: 50,
    spec_post_process: spec => {/*spec.width = "container";*/ spec.background='rgba(0,0,0,0)'; return spec}
  }))
  return result
    })
  }
  </div>
  </div>
</div>


```js
//display=false
import * as model from './cul/calcs_esm/cul_scope_0.js'
import {FileAttachment} from "npm:@observablehq/stdlib";

const introspection = await FileAttachment('./cul/calcs.introspection.json').json()
const cul = await FileAttachment('./cul/calcs.cul.js').text()
const esm = await FileAttachment('./cul/calcs_esm/cul_scope_0.js').text()

const inputs = Object.values(introspection.cul_functions).filter(d => d.reason == 'input definition').map(d => d.name).sort()

const formulae_not_inputs = Object.values(introspection.cul_functions).filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)

import { calcuvizspec } from "../components/helpers.js"
```


```js
import embed from 'npm:vega-embed';

//const embed = 

const n_in_Input = Inputs.input(8);
const n_in = Generators.input(n_in_Input);
const radius_in_Input = Inputs.input(7);
const radius_in = Generators.input(radius_in_Input);

const toggle_Input = Inputs.input("cul");
const toggle = Generators.input(toggle_Input);
```

```js
// from https://observablehq.com/framework/lib/vega-lite
// because embed doesn't work? (=> no tooltips)
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);
```