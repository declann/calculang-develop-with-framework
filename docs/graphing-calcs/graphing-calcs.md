---
title: Graphing Calcs ❤️
---

# Graphing Calcs ❤️

```js
import * as model from './cul/calcs_esm/cul_scope_0.js'

view(model)

import { calcuvizspec } from "../components/helpers.js"
```

```js
const n_in = view(Inputs.range([0,20], {step:0.1, value:1, label:'n_in'}))
const radius_in = view(Inputs.range([0,20], {step:0.1, value:7, label:'radius_in'}))
```

```js

let spec = calcuvizspec({
  models: [model],
  input_cursors: [{n_in, radius_in}],
  mark: {type:'line', point: false},
  encodings: {
    x: { name: 'x_in', type: 'quantitative', domain: _.range(-10,10,0.05) },
    y: { name: 'value', type: 'quantitative' },
    row: {
      name: 'formula', sort:'descending',
      domain: ['line', 'x', 'wave', 'semi_circle', 'result']
    },
    color: {
      name: 'formula', sort:'descending', legend: false
    }
  },
  width: 700,
  height: 200,

  // viz customizations:
  spec_post_process: spec => {
    //spec.encoding.x.axis = { grid: false, domain: false, ticks: 0, labels: false }
    //spec.encoding.y.axis = { grid: false, domain: false, ticks: 0, labels: false }
    return spec
  }
})

view(spec)

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