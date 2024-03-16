---
title: reactive inputs
toc: false
---

<details><summary>reactive todos</summary>

- model default changes => change UI,
  - but only possible (w/o bombing user changes) if I track what user changed
  - state management? local storage?

```js
import {up, upF} from './components/reactive-inputs.js'
```

inputs, but move this to dependencies (see Layers)

first I need to add Outputs and 

how will `up()` process/pick up changes to dependencies?

</details>

```js
// define inputs
const minibinds = ({
  //c_in: Inputs.range([0,100], {label:'c_in', step:1}),
  a_in: Inputs.range([0,100], {label:'a_in', step:1}),
  t_in: Inputs.range([0,100], {label:'t_in', step:1}),
  month_in: Inputs.range([-1,20], {label:'month_in', step:1}),
  //  x_in: Inputs.range([0,100], {label:'x_in', step:1})
})
```

```js
minibinds; // when minibinds change, we really want to delete and recreate inputs
document.querySelectorAll('.inputs .flash').forEach(d => d.remove())
inputs_ui.dataset.inputs = '' // up ran first? so use fake to control order:
const fake = ''
```

### inputs ui:

Reactive UI for OPTIONAL amt of things. Restricted to relevant inputs

```js
const inputs_ui = document.createElement('div')
inputs_ui.className = 'inputs'
```

```js
console.log("don't repeat")

const cursor_Input = Inputs.input({})
const cursor = Generators.input(cursor_Input)
display(inputs_ui)
```

```js
//display(cursor)
```

```js
//if (el.dataset.inputs == undefined) up(el, cursor_Input, inputs, model, minibinds);
```

```js
const dependencies_set = selected_formulae.filter(d => d.slice(-3) != '_in').map(e => introspection.cul_input_map[`0_${e}`]).reduce((acc,val) => new Set([...val, ...acc]), new Set())
const dependencies = [...dependencies_set]
```

```js
fake;
cursor; // need to react to changes to cursor
up(inputs_ui, cursor_Input, dependencies, model, minibinds); // must keep minibinds sep. to pick up updates
// because needs to detect removal for flash (above)
```

<form id="selected_formulae"></form>

```js
upF(document.querySelector('#selected_formulae'), selected_formulae_Input, formulae_not_inputs);
```


*reactivity broken on model edit due to formulae_not_inputs -> selected_formulae*


```js
//const selected_formulae = view(Inputs.checkbox(formulae_not_inputs, {label: "formulae",  value: ["npv", "total_cf"]/*formulae_not_inputs*/}));

const selected_formulae_Input = Inputs.input({answer:true})
const selected_formulae2 = Generators.input(selected_formulae_Input)
```
```js
const selected_formulae = Object.entries(selected_formulae2).filter(([k,v]) => v).map(([k,v]) => k)
```

<div id="viz"></div>

```js
const data = calcudata({
    models: [model],
    input_domains: { },
    input_cursors: [cursor],
    outputs: selected_formulae
  })
```

```js

const spec = ({
  // vega-lite
  mark: {type:'text', tooltip:true, fontSize:20},
  encoding: {
    y: { field: 'formula', type: 'nominal' },
    color: { field: 'formula', type: 'nominal', legend: false },
    text: {field: 'value', type: 'nominal', format:',.2f'},
  },
  data: { name: "data" },
  width: 200,
  //height: 200,
})

const viz = embed('#viz', spec)

```


```js
viz.view.data("data", data)/*.resize()*/.run(); // turn off resize
```

## Domains

Now TODO domain things => reactive calcudata call




```js

const esm_nomemo = compile(cul_default)
const esm = compileWithMemo(cul_default)
const introspection = introspection2(cul_default)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)


const u = URL.createObjectURL(new Blob([esm.code], { type: "text/javascript" }))
console.log(`creating ${u}`)

const model = await import(u)


invalidation.then(() => {console.log(`revoking ${u}`); URL.revokeObjectURL(u)});
```


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/reactive.cul.js').text()

import { calcuvizspec, calcudata } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"
import {Scrubber} from './components/scrubber.js'

import {calcuvegadata} from './components/calcuvegadata.js'


import embed_ from 'npm:vega-embed';

const embed = (a,b,options) => embed_(a,b, {renderer:'svg', ...options});
```
<details><summary>calculang -> esm</summary>

ESM output

```js
const esm_memo = view(Inputs.toggle({label:'include memo optimisation code?'}))
```

```js echo
esm_memo? esm.code : esm_nomemo.code
```

</details>