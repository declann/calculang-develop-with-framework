---
title: Savings Calculator 🪙🪙 (GALLERY DEV)
toc: false
---

<details><summary>debug things</summary>

```js

function highlight(d) {
  let ans = false
  highlights.forEach(e => {
    //Object.keys()
    if (e.cursor.year_in == d.year_in && e.from.split('_')[1] == d.formula) // loop through domains? or all keys? (alternatives surely better) Only limited things mapped to visual
      ans = true
  })
  return ans
}

function current(d) {
  let ans = false
  if (d.formula == formula && d.year_in == cursor.year_in)
    ans = true
  return ans
}

const data_source_with_highlights = data_source.map(
  d => ({...d, highlight: highlight(d), current: current(d)})
)

display(Inputs.table(data_source_with_highlights))
```

```js
display(Inputs.table(calls_annotations))
display(Inputs.table(calls_annotations.map(d=>d.cursor)))
display(formula)

const highlights =  calls_annotations.map(d => ({...d, /*ambiguous (from/to better)*/ formula:d.to.split('_')[1]}))
    .filter(d => d.formula == formula)
```

</details>

```js
setCursor('duration_in',duration_in)
setCursor('year_in',year_in)
setCursor('interest_rate_in',interest_rate_in)
setCursor('annual_payment_in',annual_payment_in)
setFormula('balance')
```

<!-- @include: /home/declan/MESSING/GitHub/calculang-develop-with-framework/docs/TEMPLATE.md -->

<div id="content">
  
# Savings Calculator 🪙🪙

<div class="card">
<details open><summary>inputs ⚙️</summary>

```js
const duration_in = view(Inputs.range([0,2000], {label:'duration', step: 1, value: 5}))
```

```js
const year_in = duration_in//view(Inputs.range([-1,duration_in], {label:'year', step: 1, value: 5}))
const annual_payment_in = view(Inputs.range([0, 20000], {label:'annual payment', step: 100, value: 1000}))
const interest_rate_in2 = view(Inputs.range([-10, 10], { label:'interest rate (%pa)', step:0.1, value: 4}))
```

```js
const interest_rate_in = interest_rate_in2/100
```

</details>
</div>

*Projected savings balance at end of year **${cursor.year_in}** is **€ ${d3.format(',.2f')(model.balance(cursor))}***

💡 *Click a number to highlight workings*

```js
const viz_placeholder = html`<div id="viz" class="card"></div>`

display(viz_placeholder)
```

```js echo
const spec = ({
  // vega-lite
    encoding: {
    x: { field: 'formula', type: 'nominal', "axis": {"labelAngle": 0, "orient": "top", title:null, "labelLimit": 300, labelFontSize: 20} },
    y: { field: 'year_in'/*, axis: {titleFontSize:20, labelFontSize: 30, } */ },
    color: {field: 'formula', legend: false},
    text: {field: 'value', format:',.2f'},
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
      mark: {type:'text', tooltip:false, from: 'data'},
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
  width: 450,//Math.min(500,content_width-30),//Math.min(400,content_width),
  height: 300-30,//Math.min(500,content_width-30)/1.2,//Math.min(400,content_width-30),
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
    formula: formulae_not_inputs,
    year_in: _.range(0,cursor.duration_in+0.1),
  },
  input_cursors: [
    { ...cursor }
  ]
})
```

```js echo
// is this data_source_with_highlights data flow ok ... ?
viz.view.data("data", data_source_with_highlights).resize().run(); // turn off resize
```


```js echo
viz.view.addSignalListener("formula", (a, b) => {
  setCursor('year_in', b.year_in[0])
  setFormula(b.formula[0])
});
```

</div>
</div>

</div><!-- close tag started in template -->


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await (await fetch('https://calculang.dev/models/savings/savings.cul.js')).text()
```


```js
// I CAN'T USE reactive width because hot reload will wipe it to 0
// https://github.com/observablehq/framework/issues/1194
const content_width = Generators.width(document.getElementById("content2")); // keep as a generator for reactivity

// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);
```
