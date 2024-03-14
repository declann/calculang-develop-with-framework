---
title: Dungeon Generator 👹👾🔫
toc: false
---

```js
import {editor as editorCm, config as eslintConfig} from '../graphing-calcs/editor.bundle.js'

const start_doc = cul_default

const doc = Mutable(start_doc) // I still have doc Input below, remove?

const editor = editorCm({doc: start_doc, update: update => {doc.value = update.state.doc.toString();}})
```

<div class="wrapper">
  <div class="lhs" style="background: lightgreen">
    <div class="grow">
    <h1>ƒ</h1>
    <!-- can I collapse things responsively? -->
    <details class="calculang"><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
    <span style="font-style: italic">editable and dangerous!</span> 🧙‍♂️⚠️
    ${display(editor.dom)}
    <details><summary>javascript ✨</summary>
    <span style="font-style: italic">generated from calculang</span> ⬆️
    ${view(Inputs.textarea({value:esm.code, rows:60, resize: true, disabled:true}))}
    </details>
    <details><summary>dev tools 🧰</summary>
    ${"todo"}
    ${display(Object.keys(introspection))}
    ${display(JSON.stringify([...introspection.cul_links]))}
    </details>
    </details>
    </div>
  </div>
  <div class="rhs" style="background: pink">
    <h1>🎨 dungeon generator</h1>
    <div class="card">
    <details><summary>inputs ⚙️</summary>
    ${view(Inputs.bind(Inputs.range([0,100], {step:1, label:'WIDTH_in'}), WIDTH_in_Input))}
    ${view(Inputs.bind(Inputs.range([0,100], {step:1, label:'HEIGHT_in'}), HEIGHT_in_Input))}
    ${view(Inputs.bind(Inputs.range([0,200], {step:1, label:'i_in'}), i_in_Input))}
    ${view(Inputs.bind(Inputs.text({label:'random seed'}), random_seed_in_Input))}
    </details>
    </div>
  <span>🦸 denotes the player; 🦸 intends to collect 💰 (superheroing is costly business); there are only pesky 👾 and 👹 in the way.</span><!--<p>Doors between rooms are a + (closed door) or ' (open door)</p>-->
  <h2>output</h2>
  <p>is the first visual below; others are things I used during development.</p>
  <span style="font-weight:bold">Speaking of development: drag this back and then forwards to watch the dungeon evolution and decision-making:</span>${view(Inputs.bind(Inputs.range([0,200], {step:1, label:'i_in'}), i_in_Input))}
  <details style="background:lightgreen; padding: 0.5rem; margin: 0.5rem; border: 1px solid blue"><summary style="font-weight:bold">calculang 🔍💬🧮</summary>
  <span>This dungeon generator is made with <a href="https://calculang.dev">calculang<a>, <span style="font-weight:bold">a language for calculations for transparency and certainty about numbers</span> 🔍💬🧮<br/>(dungeons are maths too)
  <p>On left/top, you can find and edit the formulas (but this is WIP and very dangerous).
  <p>Better to find the source code <a href="https://github.com/declann/calculang-develop-with-framework/tree/dev/docs/dungeon">on GitHub</a> and PRs are welcome.</p>
  <p>Tell me if you want to make 🦸 a playable character! (x 👹 and 👾) You won't even need to pay me royalties. Try <a href="https://calculang-at-fosdem.pages.dev/?id=raycasting2">raycasting</a>?</p>
  </details>
  <details style="padding: 0.5rem; margin: 0.5rem"><summary style="">inspiration 🧙</summary><p>The basis of this is something impressive I found written in C. Mine is slower! But I'll leave a broader comparative analysis for another time or for someone else!</p>
  <a href="https://gist.github.com/munificent/b1bcd969063da3e6c298be070a22b604">Here</a> is the pretty dungeon generator by <a href="https://journal.stuffwithstuff.com/">Bob Nystrom</a>, but I very closely followed the logic from <a href="https://gist.github.com/Joker-vD/cc5372a349559b9d1a3b220d5eaf2b01">this</a> helpful commented version.
  </details>
</span>
  <div class="card" id="fields"></div>
  <div class="card" id="rectangles"></div>
  <!--<span>floor_overlap ${model.floor_overlap({WIDTH_in, HEIGHT_in, random_seed_in, i_in})}</span>-->
  <!--<span>wall_overlap2 ${JSON.stringify(model.wall_overlap2({WIDTH_in, HEIGHT_in, random_seed_in, i_in}))}</span>-->
  <!--<span>door ${JSON.stringify(model.door({WIDTH_in, HEIGHT_in, random_seed_in, i_in}))}</span>-->
  <!--<span>${model.player_x({WIDTH_in, HEIGHT_in, random_seed_in})}</span>
  <span>${model.player_y({WIDTH_in, HEIGHT_in, random_seed_in})}</span>-->
  <div class="card" id="viz"></div>
  <div style="visibility:hidden">
  ${resize(rectangles_viz)}
  ${resize(field_viz)}
  ${resize(width => {
      const result = embed('#viz', calcuvizspec({
    models: [model],
    input_cursors: [{WIDTH_in, HEIGHT_in, random_seed_in}],
    mark: {type:'point', point: false, clip:true},
    encodings: {
      x: { name: 'i_in', type: 'quantitative', grid:false, domain: _.range(0,10) },
      y: { name: 'value', type: 'quantitative', grid:false, independent: true},
      row: { name: 'formula', domain: formulae_not_inputs },
      color: { name: 'formula', legend: false }
    },
    width:Math.min(300,width-150), // messy !!! container width works but overstates
    height: 50,
    spec_post_process: spec => {/*spec.width = "container";*/ spec.background='rgba(0,0,0,0)'; return spec}
  }))
  return result
    })
  }
  </div>
  </div>
</div>

```js
const rectangles_viz = width => {
      const result = embed('#rectangles', calcuvizspec({
    models: [model],
    input_cursors: [{WIDTH_in, HEIGHT_in, random_seed_in}],
    mark: {type:'rect', point: false, clip:true},
    encodings: {
      //row: { name: 'i_in', type: 'quantitative', grid:false, domain: _.range(0,10) },
      color: { name: 'i_in', type: 'quantitative', grid:false, domain: _.range(0,i_in), legend: false },
      x: { name: 'left', type: 'quantitative', grid:false, independent: false},
      y: { name: 'top', type: 'quantitative',domain: formulae_not_inputs, sort: 'descending' },
      x2: { name: 'x2', type: 'quantitative' },
      y2: { name: 'y2', type: 'quantitative' },
      row: { name: 'accept', type: 'ordinal', sort: 'descending' },
      //order: { name: 'i_in', type: 'quantitative', grid:false, domain: _.range(0,i_in), legend: false, sort: 'descending' },

    },
    width: width-125,
    //width:Math.min(300,width-150), // messy !!! container width works but overstates
    height: 80,
    spec_post_process: spec => {/*spec.width = "container";*/ spec.background='rgba(0,0,0,0)'; return spec}
  }))
  return result
    }
```

```js
const field_viz = width => {
      const result = embed('#fields', calcuvizspec({
    models: [model],
    input_cursors: [{WIDTH_in, HEIGHT_in, random_seed_in, i_in}],
    mark: {type:'text', fontStyle: 'bold', align: 'center', font:'monospace'},
    encodings: {
      //row: { name: 'i_in', type: 'quantitative', grid:false, domain: _.range(0,10) },
      //color: { name: 'i_in', type: 'ordinal', grid:false, domain: _.range(0,10), legend: false },
      x: { name: 'x_in', type: 'ordinal', domain: _.range(0,WIDTH_in)},
      y: { name: 'y_in', type: 'ordinal',domain: _.range(0,HEIGHT_in) },
      text: {name: 'value' },
      color: {name: 'value', legend: false },
      row: {name: 'formula', domain: ['FIELD','proposed_tiles']}
      //x2: { name: 'x2', type: 'quantitative' },
      //y2: { name: 'y2', type: 'quantitative' },
    },
    width: width-125,
    //width:Math.min(300,width-150), // messy !!! container width works but overstates
    height: 250,
    spec_post_process: spec => {
      spec.encoding.size = {value:13, condition: {value: 20, test: "datum.value == '🦸'"}}
      /*spec.width = "container";*/ spec.background='rgba(0,0,0,0)'; return spec}
  }))
  return result
    }
```

```js

const esm = compileWithMemo(doc)
const introspection = introspection2(doc)
//display(introspection.cul_input_map) todo put under devtools
//display(introspection)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

//display(Object.values(introspection.cul_functions))
//display([...introspection.cul_functions.values()])

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)
//display(formulae_not_inputs)


const u = URL.createObjectURL(new Blob([esm.code], { type: "text/javascript" }))
console.log(`creating ${u}`)

const model = await import(u)

//display(model)

invalidation.then(() => {console.log(`revoking ${u}`); URL.revokeObjectURL(u)});

```


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./dungeon.cul.js').text()

import { calcuvizspec } from "../components/helpers.js"

import { compile, introspection2, compileWithMemo } from "../components/mini-calculang.js"
```


```js
import embed from 'npm:vega-embed';

const HEIGHT_in_Input = Inputs.input(40/2);
const HEIGHT_in = Generators.input(HEIGHT_in_Input);

const WIDTH_in_Input = Inputs.input(80/2);
const WIDTH_in = Generators.input(WIDTH_in_Input);

const i_in_Input = Inputs.input(100);
const i_in = Generators.input(i_in_Input);

const random_seed_in_Input = Inputs.input("random12");
const random_seed_in = Generators.input(random_seed_in_Input);


const toggle_Input = Inputs.input("cul");
const toggle = Generators.input(toggle_Input);

// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);

```
