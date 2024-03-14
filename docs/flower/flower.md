---
title: 🌸 (old-style)
draft: true
---

# Flower calcs 🌸

```js
//flower = require('https://calculang.dev/models/maths-art/flower/flower.js')

//import * as model from 'https://calculang.dev/models/maths-art/flower/flower.js'

//import * as model from '../components/cul_scope_0.js'
import * as model from './cul/flower_esm/cul_scope_0.js'

view(model)
```

```js
view(3+3) // we do this with view to see things and we don't do viewof for inputs as in OHQ:

const petal_num_in = view(Inputs.range([0,50], {label:'# petals', value: 7, step: 1}))
const petal_size_in = view(Inputs.range([0,50], {label:'petal size', value: 30, step:1}))
const petals_roundy_spikiness_in = view(Inputs.range([0,2], {label:'petals roundy/spikiness', value: 0.5, step:0.1}))
const flower_big = view(Inputs.toggle({label:'big?', value: false}))
```

```js
// embed isn't working, so I do it differently below
//import embed from "npm:vega-embed";

// we can't import from OHQ
//import notebook from "@declann/little-calculang-helpers";

// so I ported key "little-calculang-helpers" here:
import { calcuvizspec } from "../components/helpers.js"
```

```js
//view(//embed(
  let spec = calcuvizspec({
    models: [model],
    input_cursors: [{petal_num_in,petal_size_in, petals_roundy_spikiness_in}],
    mark: 'rect', // heatmap
    encodings: {
      x: { name: 'column_in', type: 'nominal', domain: _.range(0,101,1) },
      y: { name: 'row_in', type: 'nominal', domain: _.range(0,101,1) },
      color: {'name': 'value', type: 'quantitative', scale: {scheme: 'brownbluegreen', reverse: true}, legend: false,  },
      row: {
        name: 'formula', sort:'descending',
        domain: ['result', 'petals', 'head','face']
      }
    },
    width: 300*(flower_big ? 1.5 : 0.8),
    height: 250*(flower_big ? 1.5 : 0.6),

    // viz customizations:
    spec_post_process: spec => {
      spec.encoding.x.axis = { grid: false, domain: false, ticks: 0, labels: false }
      spec.encoding.y.axis = { grid: false, domain: false, ticks: 0, labels: false }
      return spec
    }
  })
//)//)

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
// splitting blocks seems to be important; no await needed. {} also good?
vl.render({
  spec
})
```
