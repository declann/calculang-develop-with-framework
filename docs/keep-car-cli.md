---
title: Keep 🚗 on the road
toc: false
---

Ref: [Up and Down the Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/) by Bret Victor

"The keep-the-car-on-the-road algorithm is a favorite example of Alan Kay when demonstrating Etoys" ...

<style>
@keyframes flash {
  from { background-color: var(--theme-blue); }
  to { background-color: none; }
}
.flash {
  animation-name: flash;
  animation-duration: 3s;
}
@keyframes flashout {
  from { background-color: pink; }
  to { opacity: 0.01; visibility:hidden; display:none }
}
.flashout {
  animation-name: flashout;
  animation-duration: 3s;
  animation-fill-mode: forwards;
}
</style>

*and some other wip things*

```js
import {up} from './components/reactive-inputs.js'
```

```js
// define inputs
const minibinds = ({
  bend_start_in: Inputs.range([0,10], {label:'bend start', step:0.02}),
  bend_angle_in: Inputs.range([0,5], {label:'bend angle (rads)', step:0.01, value: Math.PI/2-0.01}),
  //r_in: html`<span style="font-decoration: strikethrough">r_in</span>`,
})
```


```js
minibinds; // when minibinds change, we really want to delete and recreate inputs
document.querySelectorAll('.flash').forEach(d => d.remove())
inputs_ui.dataset.inputs = '' // up ran first? so use fake to control order:
const fake = ''
```


<div id="viz2"></div>

### inputs ui:

```js
const domains2 = {
    formula: /*formulae_not_inputs*/ ["road",/*"road2","roadm2",*/ "a1","a2","a3"],
    t_in: _.range(0,500,1)
  };

const spec2 = ({
  // vega-lite
  layer: [{
    mark: {type:'point', tooltip:true},
    encoding: {
      x: { field: 'carx', type: 'quantitative', scale: { domain: d3.extent(domains.x_in) } },
      y: { field: 'cary', type: 'quantitative', scale: { domain: d3.extent(domains.y_in) } },
      detail: { field: 't_in', type: 'nominal', sort: 'descending' },
      color: { field: 'car_offroad', type: 'nominal' },
    },
    data: { name: "data" },
  },
  ],
  datasets: {
    data: [],
    cursor: []
  },
  // autosize breaks consistency when mappings change
  //autosize: { "type": "fit", "contains": "padding"},
  width: 400,//Math.min(400,rhs_width-30),
  height: 150,
  background:'rgba(0,0,0,0)'
})

// interactivity via vega signals and listeners
const viz2 = embed('#viz2', spec2, {patch: [{
  path: "/signals",
  op: "add",
  value: [{
    name: "animation",
    //value: 8,
  }]
}]})
```


```js
const data_source2 = calcuvegadata({
  models: [model],
  spec: spec.layer[1],
  domains: domains2,
  input_cursors: [
    cursor
  ]
})

display(spec2)

```

```js
viz2.view.data("data", data_source2).resize().run(); // turn off resize
```

```js
viz.view.data("data2", data_source2).resize().run(); // turn off resize
```

---

```js
const inputs_ui = document.createElement('div')
```

```js
console.log("don't repeat")

const cursor_Input = Inputs.input({})//Mutable({})
const cursor = Generators.input(cursor_Input)

display(inputs_ui)
```

```js
display(inputs)

display(model.cy({}))

display(model)
```


### inputs cursor:

```js
display(cursor)
```

```js
view(t_in_Input)
```

```js
fake;
cursor; // need to react to changes to cursor
up(inputs_ui, cursor_Input, inputs, model, minibinds); // must keep minibinds sep. to pick up updates
// because needs to detect removal for flash (above)
```



```js
const f0 = view(Inputs.select(['offset','offroad'], {label: 'formula', value: 'offroad'}))
```


<div id="viz"></div>

---


## appendix & source code of 🎨

*showing selected source code of 🎨*

For complete source see [GitHub](https://github.com/declann/calculang-develop-with-framework/tree/dev).

<details><summary>notes</summary>this is Javascript and using tools and patterns that I repeat, but remember that calculang is unopinionated!<br />
calculang/output is also highly portable and uniform.</details>

---

![](./ffox.png)

## visual 1 (main output, with mouse interactivity)

```js echo
const vs_i = {
  encodings: {
    x: 'x_in',
    y: 'y_in',
    color: f0,
    size: '',
    shape: '',
    opacity: ''
  }
}

const domains = {
    formula: /*formulae_not_inputs*/ ["road",/*"road2","roadm2",*/ "a1","a2","a3"],
    x_in: _.range(0,25,0.3),
    y_in: _.range(-3,7,0.3)
  };

const spec = ({
  // vega-lite
  layer: [{
    mark: {type:'rect', tooltip:true},
    encoding: {
      x: { field: vs_i.encodings.x, type: 'nominal', axis:null },
      y: { field: vs_i.encodings.y, type: 'nominal', axis:null, sort: 'descending' },
      color: {field:vs_i.encodings.color, type: 'nominal', scale: {range:'diverging'}, legend: false},
      //detail: {field:vs_i.encodings.detail}, // I guess works
      //row: {field:vs_i.encodings.row}, // TODO (this vega lite)
      //col: {field:vs_i.encodings.col}, // TODO (this vega lite)
      size: {field:vs_i.encodings.size},
      shape: {field:vs_i.encodings.shape},
      //anim__: {field:vs_i.encodings.anim},
      opacity: vs_i.encodings.shape != '' ? {field:vs_i.encodings.shape} : {}, // OVERRIDES APPROACH?
    },
    data: { name: "data" },
  },
  {
    mark: {type:'point', tooltip:true},
    encoding: {
      x: { field: 'carx', type: 'quantitative', scale: { domain: d3.extent(domains.x_in) } },
      y: { field: 'cary', type: 'quantitative', scale: { domain: d3.extent(domains.y_in) } },
      detail: { field: 't_in', type: 'nominal', sort: 'descending' },
      color: {value: 'green'},
            trick__: {field: 'car_angle'}

      //color: { field: 'car_offroad', type: 'nominal' },
    },
    data: { name: "data2" },
  },
  {
  "mark": {"type": "image", "width": 50, "height": 50},
    transform: [{filter: "datum.t_in == t_in"}], // detect t_in by datum.thing search?
    encoding: {
      x: { field: 'carx', type: 'quantitative', scale: { domain: d3.extent(domains.x_in) } },
      y: { field: 'cary', type: 'quantitative', scale: { domain: d3.extent(domains.y_in) } },
      url: { value: '/_file/ffox.png',  type: 'nominal' }, // from https://freepngimg.com/png/11315-car-free-download-png
      color: {value: 'green'},
      size: {value:30},
      opacity: {value:0.02}
      //angle: {value: -10}
      //color: { field: 'car_offroad', type: 'nominal' },
    },
    data: { name: "data2" },
  },
  {
  "mark": {"type": "text", "width": 50, "height": 50, fontWeight:'bold', baseline: 'middle', align:'center'},
    transform: [{filter: "datum.t_in == t_in"}, {calculate: "-datum.car_angle*57", "as" :"car_angle2"}],
    encoding: {
      x: { field: 'carx', type: 'quantitative', scale: { domain: d3.extent(domains.x_in) } },
      y: { field: 'cary', type: 'quantitative', scale: { domain: d3.extent(domains.y_in) } },
      text: { value: '🚗',  type: 'nominal' }, // from https://freepngimg.com/png/11315-car-free-download-png
      color: {value: 'red'},
      size: {value:30},
      //detail: {field: 't_in'}
      //angle: {value: 90},
      angle: {field: "car_angle2", type:'quantitative', scale: {domain:[0,360],range:[0,360]}},
      //color: { field: 'car_offroad', type: 'nominal' },
    },
    data: { name: "data2" },
  },
  /*{
    transform: [{filter: `0 && datum.t_in == animation`}], // TODO lookup anim encoding
    mark: {type:'point', point: false, filled: false, strokeWidth:5, tooltip:true},
    encoding: {
      opacity: {value: .5},
      x: { field:vs_i.encodings.x, type: 'quantitative' },
      y: { field:vs_i.encodings.y, type: 'quantitative' },
      size: {value: 800},
      //color: {field:vs_i.encodings.color, type: 'nominal'}
    },
    data: { name: "data" },
  }*/
  ],
  // autosize breaks consistency when mappings change
  //autosize: { "type": "fit", "contains": "padding"},
  width: 400,//Math.min(400,rhs_width-30),
  height: 150,
  background:'rgba(0,0,0,0)',
})

// interactivity via vega signals and listeners
const viz = embed('#viz', spec, {patch: [{
  path: "/signals",
  op: "add",
  value: [{
    name: "t_in",
    //value: 8,
  }]
}]})
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
  spec: spec.layer[0],
  domains,
  input_cursors: [
    cursor
  ]
})

display(spec)

display(Inputs.table(data_source2))//).filter(d => d.x_in <0)))
//display(Inputs.table(data_source_cursor))
```

```js echo
viz.view.data("data", data_source).resize().run(); // turn off resize
```

```js echo
viz.view.signal('t_in', t_in).run()
```


---

```js echo
const size_in = 16

const t_in_Input = Inputs.range([0,1000],{label:'t_in', step:1, value:0})//input(0);
const t_in = Generators.input(t_in_Input);

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

const cul_default = await FileAttachment('./cul/keep-car-cli.cul.js').text()

import { calcuvizspec, calcudata } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"
import {Scrubber} from './components/scrubber.js'

import {calcuvegadata} from './components/calcuvegadata.js'


import embed_ from 'npm:vega-embed';

const embed = (a,b,options) => embed_(a,b, {renderer:'svg', ...options});
```
