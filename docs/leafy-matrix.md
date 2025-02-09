---
title: Leafy matrix 🍂🧑‍💻 (GALLERY DEV)
toc: false
---

```js
import {Scrubber} from './components/scrubber.js'
```

<!-- @include: /home/declan/repos/calculang-develop-with-framework/docs/TEMPLATE.md -->

<div id="content">
  
# Leafy matrix 🍂🧑‍💻

Leaf from Lu Wilson [@TodePond ](https://twitter.com/TodePond/status/1777580961938407797)

<div class="card">
<details open><summary>inputs ⚙️</summary>
${view(Inputs.bind(Scrubber(_.range(0,100), {value: 10, delay: 15, autoplay: false, loop:false}), n_in_Input))}
</details>
</div>

```js
const viz_placeholder = html`<div id="viz" class="card"></div>`

display(viz_placeholder)
```

```js
const mark = view(Inputs.select(["rect","text","point"], {label:'mark', value:'point', width:100}))
```

```js echo
const spec = ({
  // vega-lite
  mark: {type:mark, tooltip:true, filled:true},
  encoding: {
    x: { field: 'x_in', type: 'nominal', scale: {domain:_.range(10,40)} },
    y: { field: 'y_in', type: 'nominal' },
    text: {field: 't', type: 'nominal' },
    color: {field:'c', type: 'quantitative', scale: {scheme:'greens'}},
    size: {field: 's', type:'quantitative', scale: {domain:[0,1], range:[0,10]}}
    //detail: {field: 'i_in', type: 'nominal'},
  },
  data: { name: "data" },
  autosize: { "type": "fit", "contains": "padding"},
  // no reactive w/h due to https://github.com/observablehq/framework/issues/1194
  width: 400,//Math.min(500,content_width-30),//Math.min(400,content_width),
  height: 400-30,//Math.min(500,content_width-30)/1.2,//Math.min(400,content_width-30),
  background:'rgba(0,0,0,0)'
})

// interactivity via vega signals and listeners
const viz = embed('#viz', spec)
```

```js echo
const data_source = calcuvegadata({
  models: [model],
  spec,
  domains: {
    x_in: _.range(0,50),
    y_in: _.range(0,50),
  },
  input_cursors: [
    { n_in }
  ]
})
```

```js echo
viz.view.data("data", data_source).resize().run(); // turn off resize
```

<details><summary>📜</summary>

```js echo
const pis = [5, 10, 20,30,50,55,60,65,70,75]
  .map(n_in => ({n_in, pi_approximation: model.pi_approximation({ n_in}), proportion_inside: model.proportion_inside({ n_in}), error: model.error({ n_in})}))

display(Inputs.table(pis, {sort: 'n_in', reverse: true, format: { pi_approximation: d3.format(',.10f'), error: d3.format(',.4f') }}))
```

</details>

</div>
</div>

</div><!-- close tag started in template -->





```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/leafy-matrix.cul.js').text()

```


```js
const n_in_Input = Inputs.input(2);
const n_in = Generators.input(n_in_Input);


// not usable with hot reload atm
// https://github.com/observablehq/framework/issues/1194
const content_width = Generators.width(document.getElementById("content2")); // keep as a generator for reactivity


// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);

```
