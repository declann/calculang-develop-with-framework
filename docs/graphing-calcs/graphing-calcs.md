---
title: Graphing Calcs ❤️
---

# Graphing Calcs ❤️

```js
import * as model from './cul/calcs_esm/cul_scope_0.js'
import {FileAttachment} from "npm:@observablehq/stdlib";

const introspection = await FileAttachment('./cul/calcs.introspection.json').json()

const inputs = Object.values(introspection.cul_functions).filter(d => d.reason == 'input definition').map(d => d.name).sort()

const formulae_not_inputs = Object.values(introspection.cul_functions).filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)

display(introspection)

display(model)

import { calcuvizspec } from "../components/helpers.js"
```

```js
const n_in = view(Inputs.range([0,20], {step:0.1, value:1, label:'n_in'}))
const radius_in = view(Inputs.range([0,20], {step:0.1, value:7, label:'radius_in'}))
```
---

<details><summary>Code</summary><!-- manual, for demo purposes -->
<pre>
let spec = calcuvizspec({
  models: [model],
  input_cursors: [{n_in, radius_in}],
  mark: {type:'line', point: false},
  encodings: {
    x: { name: 'x_in', type: 'quantitative', domain: _.range(-10,10,0.01) },
    y: { name: 'value', type: 'quantitative' },
    row: {
      name: 'formula', sort:'descending',
      domain: formulae_not_inputs
    },
    color: {
      name: 'formula', sort:'descending', legend: false
    }
  },
  width: 700,
  height: 200
})
</pre>
</details>

```js
let spec = calcuvizspec({
  models: [model],
  input_cursors: [{n_in, radius_in}],
  mark: {type:'line', point: false},
  encodings: {
    x: { name: 'x_in', type: 'quantitative', domain: _.range(-10,10,0.01) },
    y: { name: 'value', type: 'quantitative' },
    row: {
      name: 'formula', sort:'descending',
      domain: formulae_not_inputs
    },
    color: {
      name: 'formula', sort:'descending', legend: false
    }
  },
  width: 700,
  height: 200
})
```

```js
// from https://observablehq.com/framework/lib/vega-lite
// because embed doesn't work? (=> no tooltips)
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);
```

```js
vl.render({
  spec
})
```
