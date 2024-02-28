---
title: Editable ❤️
toc: false
---

<style>
#observablehq-main {
  max-width: 1500px;
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

.lhs details {
  margin:10px 0; /* 0->6px creates a indentation effect */
}

details[open] > summary.calculang {
  background: #aaa4;
  cursor: zoom-out;
  /*border: 1px dotted orange;*/
}

details > summary {
  user-select: none;
}

details > summary.calculang {
  border: 1px dashed orange;
  background: #faa4;
  cursor: zoom-in;
}

details > summary.calculang {
  font-weight: bold;
}

.wrapper {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.lhs:has(div details.calculang:not([open])) {
  width: 150px;
  opacity: 0.6;
  transition: width 100ms ease-out opacity 200ms linear;
}

.lhs:has(div details.calculang:not([open])):hover {
  opacity: 1;
  transition: width 200ms linear, opacity 60ms linear;

}

.observablehq-pre-container {
  margin: 1rem 0; /* -1rem -> 0 */
}

pre {
  margin: 1rem 0;
}

.wrapper > div {
  padding: 0.5rem;
  /*max-height:50vh;*/
  border-radius: 20px;
  height: fit-content;
  width: 90%;
  transition: width 200ms ease-out;
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
    ${view(Inputs.bind(Inputs.range([0,25], {step:0.1, value:8, label:'n_in'}), n_in_Input))}
    ${view(Inputs.bind(Inputs.range([0,10], {step:0.1, value:7, label:'radius_in'}), radius_in_Input))}
    </details>
    </div>
  <div class="card" id="viz"></div>
  <div style="visibility:hidden">
  ${resize(width => {
      const result = embed('#viz', calcuvizspec({
    models: [model],
    input_cursors: [{n_in:n_in, radius_in}],
    mark: {type:'line', point: false, clip:true},
    encodings: {
      x: { name: 'x_in', type: 'quantitative', grid:false, domain: _.range(-10,10,0.01) },
      y: { name: 'value', type: 'quantitative', grid:false, "scale": {"domain": [-10,18]}},
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
  </div>
  </div>
</div>


```js

const esm = compile(cul).code
const introspection = introspection2(cul)
display(introspection.cul_input_map)
display(introspection)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

display(Object.values(introspection.cul_functions))
display([...introspection.cul_functions.values()])

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)
display(formulae_not_inputs)


const model = await import(URL.createObjectURL(new Blob([esm], { type: "text/javascript" })).toString())

//display(model)


```


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/calcs.cul.js').text()

import { calcuvizspec } from "../components/helpers.js"

import { compile, introspection2 } from "../components/mini-calculang.js"
```


```js
import embed from 'npm:vega-embed';

const n_in_Input = Inputs.input(8);
const n_in = Generators.input(n_in_Input);
const radius_in_Input = Inputs.input(7);
const radius_in = Generators.input(radius_in_Input);

const toggle_Input = Inputs.input("cul");
const toggle = Generators.input(toggle_Input);

// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(`export const x = () => x_in;
export const n = () => n_in;
export const radius = () => radius_in;

export const line = () => Math.abs(2*x());

export const wave = () => Math.sin(x() * n());

export const semi_circle = () => {
  if (Math.abs(x()) > radius()) return 0;
  else return (radius() ** 2 - x() ** 2) ** 0.5;
};

export const result = () =>
      line() + semi_circle() * wave();`);
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