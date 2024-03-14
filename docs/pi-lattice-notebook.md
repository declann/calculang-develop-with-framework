---
title: Pi lattice dev
toc: false
draft: true
---

```js
import {up} from './components/reactive-inputs.js'
```

```js
display(introspection)
```

```js
// define inputs
const minibinds = ({
  n_in: Inputs.range([1,75], {label: 'n', step: 1, value: 10}),
  // inclusive_in: Inputs.toggle() doesnt work ?!
  inclusive_in: Inputs.range([0,1], {label:'inclusive off/on', step:1}),
  //i_in: html`<input disabled>`
})
```


```js
minibinds; // when minibinds change, we really want to delete and recreate inputs
document.querySelectorAll('.flash').forEach(d => d.remove())
inputs_ui.dataset.inputs = '' // up ran first? so use fake to control order:
const fake = ''
```


```js
const inputs_ui = document.createElement('div')
```

```js
console.log("don't repeat")

const cursor_Input = Inputs.input({n_in:10})//Mutable({})
const cursor = Generators.input(cursor_Input)

display(inputs_ui)
```

```js
display(inputs)

display(model)
```


### inputs cursor:

```js
display(cursor)
```


```js
fake;
cursor; // need to react to changes to cursor
up(inputs_ui, cursor_Input, inputs, model, minibinds); // must keep minibinds sep. to pick up updates
// because needs to detect removal for flash (above)
```



<div id="viz"></div>

inside ${model.count_inside({...cursor})}

pi approx ${model.pi_approximation({...cursor})}

<details><summary>📜</summary>

```js echo
const pis = [5, 10, 20,30,50,55,60,65,70,75]
  .map(n_in => ({n_in, pi_approximation: model.pi_approximation({...cursor, n_in}), error: model.error({...cursor, n_in})}))

display(Inputs.table(pis, {sort: 'n_in', reverse: true, format: { pi_approximation: d3.format(',.10f'), error: d3.format(',.4f') }}))
```

</details>

---


## appendix & source code of 🎨

*showing selected source code of 🎨*

For complete source see [GitHub](https://github.com/declann/calculang-develop-with-framework/tree/dev).

<details><summary>notes</summary>this is Javascript and using tools and patterns that I repeat, but remember that calculang is unopinionated!<br />
calculang/output is also highly portable and uniform.</details>

---


## visual 1 (main output, with mouse interactivity)

```js echo
const vs_i = {
  encodings: {
    x: 'x',
    y: 'y',
    color: 'inside',
    size: '',
    shape: '',
    opacity: '',
    detail: 'i_in'
  }
}

const domains = {
    //x_in: [..._.range(0,1,0.01), 1],
    //y_in: [..._.range(0,1,0.01), 1],
    i_in: _.range(0,cursor.n_in ** 2)
  };

const spec = ({
  // vega-lite
  //layer: [{
    mark: {type:'point', tooltip:true, filled:true},
    encoding: {
      x: { field: vs_i.encodings.x, type: 'quantitative', scale: { domain: [0,1]} },
      y: { field: vs_i.encodings.y, type: 'quantitative', scale: { domain: [0,1]}  },
      color: {field:vs_i.encodings.color, type: 'nominal', sort: 'descending', legend: true},
      detail: {field:vs_i.encodings.detail}, // I guess works
      //row: {field:vs_i.encodings.row}, // TODO (this vega lite)
      //col: {field:vs_i.encodings.col}, // TODO (this vega lite)
      size: {field:vs_i.encodings.size},
      shape: {field:vs_i.encodings.shape},
      //anim__: {field:vs_i.encodings.anim},
      opacity: vs_i.encodings.shape != '' ? {field:vs_i.encodings.shape} : {}, // OVERRIDES APPROACH?
    },
    data: { name: "data" },
  //},
  //],
  // autosize breaks consistency when mappings change
  //autosize: { "type": "fit", "contains": "padding"},
  width: 400,//Math.min(400,rhs_width-30),
  height: 300,
  background:'rgba(0,0,0,0)',
})

// interactivity via vega signals and listeners
const viz = embed('#viz', spec)
```

new messing:

```js echo
import * as traverseObj from "npm:object-traversal";
import {uniq} from "npm:underscore";


const p = (spec) => {

  const mappings = (spec) => {
  let v = [];
  traverseObj.traverse(spec, (a) => {
    //console.log(a);
    if (a.key == "field") {
      v.push({ field: a.value, input_domain: a.parent.input_domain });
      //console.log("CAPTURE ", a); // CAPTURE MARK AND TYPE ALSO?
    }
  });
  return /*_.*/uniq(v.map((d) => d.field)); // return {mapped, summary}
  }

  console.log('dn', mappings(spec))
}

p(spec)
```

```js echo
const data_source = calcuvegadata({
  models: [model],
  spec: spec,
  domains,
  input_cursors: [
    cursor
  ]
})

display(spec)

display(data_source)

//display(Inputs.table(data_source))
```

```js echo
viz.view.data("data", data_source).resize().run(); // turn off resize
```


```js echo
const size_in = 16

```

```js

const esm = compileWithMemo(cul_default)
const introspection = introspection2(cul_default)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)


const model = await import(URL.createObjectURL(new Blob([esm.code], { type: "text/javascript" })).toString())
```


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/pi-lattice.cul.js').text()

import { calcuvizspec, calcudata } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"
import {Scrubber} from './components/scrubber.js'

import {calcuvegadata} from './components/calcuvegadata.js'


import embed_ from 'npm:vega-embed';

const embed = (a,b,options) => embed_(a,b, {renderer:'svg', ...options});
```
