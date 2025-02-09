---
title: Spirographs (GALLERY DEV)
toc: false
---

<style>
.observablehq--error {
  display: none !important
}
  </style>

```js
setCursor('t_in', 0);
setCursor('p_in', 3);
```
```js
setCursor('random_seed_in', random_seed_in);
```

```js
// needed (empty ok)
const excludes = [];
```


```js

function highlight(d) {
  let ans = false
  highlights.forEach(e => {
    //Object.keys()
    if (e.cursor[y] == d[y] && e.from.split('_')[1] == d.formula) // loop through domains? or all keys? (alternatives surely better) Only limited things mapped to visual
      ans = true
  })
  return ans
}

// + current row ?
function current(d) {
  let ans = false
  if (d.formula == formula && d[y] == cursor[y])
    ans = true
  return ans
}

const data_source_with_highlights = data_source.map(
  d => ({...d, highlight: highlight(d), current: current(d)})
)

```

```js

const highlights =  calls_annotations.map(d => ({...d, /*ambiguous (from/to better)*/ formula:d.to.split('_')[1]}))
    .filter(d => d.formula == formula)
```

```js
setFormula('X');
```

<!-- @include: /home/declan/repos/calculang-develop-with-framework/docs/TEMPLATE.md -->

<div id="content">
  
# 🌀 Generative Spirographs

<div class="card" style="margin-bottom:-20px">
<details open><summary>inputs ⚙️</summary>

```js
//const t_in = view(Inputs.range([0,500], {label: 't_in', value: 5*12, step:1}))
const random_seed_in = view(Inputs.range([0,50], {label: 'random_seed_in', value: 0, step:1}))
//const random_seed_in = view(Inputs.text({label: "random seed", placeholder: "random seed", value: "hello"}))
```

</details>
</div>

```js
const viz_placeholder = html`<div id="viz" class="card"></div>`
const viz_placeholder2 = html`<div id="viz2" class="card"></div>`

display(viz_placeholder2)
```
💡 *Click a number to highlight workings*

```js
const y = view(Inputs.select(["t_in"], {label: 'y axis', value: 't_in'}))
```


```js
display(viz_placeholder)
```
```js

const spec2 = ({
  width: 500,
  height: 400,
  mark: 'point',
  encoding: {
    x: {field: 'X', type: 'quantitative', scale: {domain: [0,120]}},
    y: {field: 'Y', type: 'quantitative', scale: {domain: [0,120]}},
    opacity: {value: 0.5},
    color: {field: 't_in', type: 'quantitative', scale: {domain: [-10,10]}, legend:null},
    detail: {field: 't_in', type: 'quantitative'}
  },
  "config": {
    "axis": {"grid": true, "tickBand": "extent"}
  },
  data: { name: "data" },
})

// interactivity via vega signals and listeners
const viz2 = embed('#viz2', spec2)
```

```js echo

const data_source2 = calcuvegadata({
  models: [model],
  spec: spec2,
  domains: {
    //formula: formulae_not_inputs.filter(d => !d.includes("model")), // JS objects mapped to values is an issue, stringify?

    //x_in: _.range(0,120),
    //y_in: _.range(0,120),
    t_in: _.range(0,24,.01),
  },
  input_cursors: [
    cursor
  ]
})

display(data_source2)
```

```js echo
// is this data_source_with_highlights data flow ok ... ?
viz2.view.data("data", data_source2).resize().run(); // turn off resize
```

```js echo
const spec = ({
  // vega-lite
    encoding: {
    x: { field: 'formula', type: 'nominal', "axis": {"labelAngle": -40, "orient": "top", title:null, "labelLimit": 300, labelFontSize: 20} },
    y: { field: y/*, axis: {titleFontSize:20, labelFontSize: 30, } */ },
    color: {field: 'formula', legend: false},
    text: {field: 'value', format:',.3f'},
    size: {value: 12}
  },
  layer: [

    {
      mark: {type:'text', fontWeight:'bold', dx:2, dy:2},
      transform: [{filter: "datum.highlight"}],
      encoding: {
            size: {value: 15},
        color: {value:'yellow'}
      }
    },
    {
      mark: {type:'text', tooltip:true, from: 'data'},
            //transform: [{filter: "!datum.current"}], // messes selection; better out or using conditional size
      encoding: {
        size: { value: 12, condition: {test: 'datum.current', value: 1} }
      },
        params: [
    {
      name: "formula",
      //value: { ray_angle_in: 0 },
      select: {
        type: "point",
        //on: "mousemove{0,50}",
        on: "[touchdown, touchup] > touchmove, mouseup, touchup, [mousedown, mouseup] > mousemove",
        //on: "[touchdown, touchup] > touchmove, [mousedown, mouseup] > mousemove", //{10, 100}",
        //        on: "[mousedown, mouseup] > mousemove",
        nearest: true,
        toggle: false,
        clear: false,
        encodings: ["x", "y"]
      }
    }
  ]

    },
    {
      mark: {type:'text', fontWeight:'bold', dx:0, dy:0},
      transform: [{filter: "datum.current"}],
      encoding: {
        color: {value:'black'},
        size: {value: 14}
      }
    },
  ],

  data: { name: "data" },
  autosize: { "type": "fit", "contains": "padding"},
  // no reactive w/h due to https://github.com/observablehq/framework/issues/1194
  width: 600,//Math.min(500,content_width-30),//Math.min(400,content_width),
  height: 1200-30,//Math.min(500,content_width-30)/1.2,//Math.min(400,content_width-30),
  background:'rgba(0,0,0,0)',
})

// interactivity via vega signals and listeners
const viz = embed('#viz', spec)
```

```js echo

const data_source = calcuvegadata({
  models: [model],
  spec,
  domains: {
    formula: formulae_not_inputs.filter(d => !d.includes("model")), // JS objects mapped to values is an issue, stringify?

    //point_id_in: _.range(1,50+0.1),
    t_in: _.range(0,20,1),
  },
  input_cursors: [
    cursor
  ]
})

display(data_source)
```

```js echo
// is this data_source_with_highlights data flow ok ... ?
viz.view.data("data", data_source_with_highlights.filter(d => typeof(d.value) != 'object')).resize().run(); // turn off resize
```


```js echo
viz.view.addSignalListener("formula", (a, b) => {
  setCursor(y, b[y][0])
  setFormula(b.formula[0])
});
```

</div>
</div>

</div><!-- close tag started in template -->


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/spirographs.cul.js').text()
//https://cdn.jsdelivr.net/gh/declann/calculang-miscellaneous-models@main/models/cashflows/simple-cfs.cul.js
```


```js
// I CAN'T USE reactive width because hot reload will wipe it to 0
// https://github.com/observablehq/framework/issues/1194
const content_width = Generators.width(document.getElementById("content2")); // keep as a generator for reactivity

// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);
```
