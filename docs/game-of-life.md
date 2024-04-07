---
title: Game of Life (GALLERY DEV)
toc: false
---

<!-- @include: /home/declan/MESSING/GitHub/calculang-develop-with-framework/docs/TEMPLATE.md -->

<div id="content">
  
<div class="card">
<details open><summary>inputs ⚙️</summary>
${view(Inputs.bind(Inputs.range([0,200], {step:1, label:'generation'}), g_in_Input))}
</details>
</div>

```js
const viz_placeholder = html`<div id="viz" class="card"></div>`

display(viz_placeholder)
```

```js echo
const spec = ({
  // vega-lite
  mark: {type:'point', point: false, filled: true, tooltip:false},
  encoding: {
    x: { field: 'x_in', type: 'ordinal', grid:false },
    y: { field: 'y_in', type: 'ordinal', grid:false },
    //row: { name: 'formula', domain: formulae_not_inputs },
    color: { field: 'alive', legend: true },
    shape: {value:'square'}
  },
  width:180, //Math.min(300,width-150), // messy !!! container width works but overstates
  height: 180,
  background:'rgba(0,0,0,0)',
  data: { name: "data" },
})

// interactivity via vega signals and listeners
const viz = embed('#viz', spec)
```

```js echo
const data_source = calcuvegadata({
  models: [model],
  spec,
  domains: {
    x_in: _.range(0,size_in),
    y_in: _.range(0,size_in),
  },
  input_cursors: [
    { size_in, initial_grid_function_in, g_in }
  ]
})
```

```js echo
viz.view.data("data", data_source)/*.resize()*/.run(); // turn off resize
```

<details open><summary>Performance notes (old)</summary>

- initial grid as a function input is very important to take stress off naive memo with JSON stringify hash

- at 50x50, rendering appears a bottleneck; bypass calcudata? (object structure poor)

- ~~stream data to vega~~, or render to canvas or css grid? (with animation?) (somehow vega svg faster than vega canvas and I think FF faster than chromium)

- memory usage is out of control: manually try memo eviction strategies

</details>

</div>
</div>


</div><!-- close tag started in template -->





```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./graphing-calcs/cul/game-of-life.cul.js').text()

```





```js
const workbook = await FileAttachment('./graphing-calcs/game-of-life.xlsx').xlsx()

const size_in = 24

//display(workbook)
//display(Object.values(workbook.sheet("Sheet1")[0]))
```


```js
const initial_grid_in0 = _.range(0,50).map(d => Object.values(workbook.sheet("Sheet1")[d]))
const initial_grid_function_in = () => initial_grid_in0//({x_in,y_in}) => initial_grid_in0[y_in][x_in]
```

```js

const g_in_Input = Inputs.input(0);
const g_in = Generators.input(g_in_Input);

```

```js

// I CAN'T USE reactive width because hot reload will wipe it to 0
// https://github.com/observablehq/framework/issues/1194
//const content_width = Generators.width(document.getElementById("content2")); // keep as a generator for reactivity


// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);

```
