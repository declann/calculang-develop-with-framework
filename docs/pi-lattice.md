---
title: Pi lattice dev
toc: false
draft: true
---

```js
import {up} from './components/reactive-inputs.js'
```

```js
// define inputs
const minibinds = ({
  num_steps_in: Inputs.range([1,100], {label: '# steps', step: 1})
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

const cursor_Input = Inputs.input({})//Mutable({})
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
view(t_in_Input)
```

```js
fake;
cursor; // need to react to changes to cursor
up(inputs_ui, cursor_Input, inputs, model, minibinds); // must keep minibinds sep. to pick up updates
// because needs to detect removal for flash (above)
```



<div id="viz"></div>

count inside ${model.count_inside({...cursor, i_in: cursor.num_steps_in ** 2})}

${model.count_inside({...cursor, i_in: cursor.num_steps_in ** 2}) / cursor.num_steps_in ** 2}

${4 * model.count_inside({...cursor, i_in: cursor.num_steps_in ** 2}) / cursor.num_steps_in ** 2}

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
    i_in: _.range(0,cursor.num_steps_in ** 2)
  };

const spec = ({
  // vega-lite
  //layer: [{
    mark: {type:'point', tooltip:true},
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
  height: 150,
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

const cul_default = await FileAttachment('./cul/pi-lattice.cul.js').text()

import { calcuvizspec, calcudata } from "./components/helpers.js"

import { compile, introspection2, compileWithMemo } from "./components/mini-calculang.js"
import {Scrubber} from './components/scrubber.js'

import {calcuvegadata} from './components/calcuvegadata.js'


import embed_ from 'npm:vega-embed';

const embed = (a,b,options) => embed_(a,b, {renderer:'svg', ...options});
```
