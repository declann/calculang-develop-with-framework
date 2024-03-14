---
title: Editable Music 🎶 (beta)
toc: false
---

# Editable Music 🎶

```js
//import {Tone} from 'npm:tonejs'
import * as Tone from 'npm:tone'

let synth = new Tone.PolySynth(Tone.Synth).chain(new Tone.Volume(0.5), Tone.Master);

  synth.set({
    oscillator: {
      type: "sine"
    },
    envelope: {
      decay: 1,
      release: 1
    }
  });
```

```js
/*const synth = {
  //create a synth and connect it to the master output (your speakers)
  let synth = new Tone.PolySynth(Tone.Synth).chain(Volume, Tone.Master);
  synth.set({
    oscillator: {
      type
    },
    envelope: {
      decay: 1,
      release: 1
    }
  });
  try {
    yield synth;
    yield invalidation;
  } finally {
    synth.dispose();
  }
}*/
```

<!--Click here to start the music!

<button>🎶</button>-->

This needs a bit of work: different tones, different instruments, different envelopes, better visualizations like that note progression(?).

Music by [Tom MacWright](https://observablehq.com/@tmcw/playing-with-tone-js) & sorry for the bugs. I wonder if small perf-delays are causing issues here?

These formulas are editable! Ideas: delete note and E5 formula and play the chords, delete chords and play the notes only; alter patterns e.g. in E5, or uncomment C4 and setup a beat for it (calculang here so mind your brackets!).

And/or: help me generalise it!

## inputs ⚙️

<div style="background:orange; color:green">Play the music by stepping carefully here! or else just go wild 😈</div>

```js
const beat_in = view(Inputs.range([-1,200], {step:1, value:-1, label:'beat_in 🎶'}))
//const radius_in = view(Inputs.range([0,20], {step:0.1, value:7, label:'radius_in'}))
```


<div class="wrapper">
  <div class="lhs" style="background: lightgreen">
    <div class="grow">
    <h1>ƒ</h1>
    <!-- can I collapse things responsively? -->
    <details class="calculang"><summary class="calculang" style="margin-bottom:10px">calculang ✍️</summary>
    <span style="font-style: italic">editable!</span> 🧙‍♂️
    <!--<pre class="f">-->${view(Inputs.bind(Inputs.textarea({ rows:60, resize: true}), cul_Input))}
    <!--</pre>-->
    <details><summary>javascript ✨</summary>
    <span style="font-style: italic">generated from calculang</span> ⬆️
    ${view(Inputs.textarea({value:esm,  rows:60, resize: true, disabled:true}))}
    </details>
    <details><summary>dev tools 🧰</summary>
    ${"todo"}
    </details>
    </details>
    </div>
  </div>
  <div class="rhs" style="background: pink">
    <h1>🎨</h1>
    <!--<div class="card">
    <details open><summary>inputs ⚙️</summary>
    <p>beat ${display(beat)}</p>
    </details>
    </div>-->
  <div class="card" id="viz2"></div>
  <div class="card" id="viz"></div>
  <div style="visibility:hidden">
  ${resize(width => {
      const result = embed('#viz', calcuvizspec({
    models: [model],
    input_cursors: [{}],
    mark: {type:'text', point: false, clip:true},
    encodings: {
      x: { name: 'beat_in', type: 'quantitative', grid:false, domain: _.range(beat_in,beat_in+40,1), scale: {zero: false, "domain": [beat_in-0.5,beat_in+40]} },
      y: { name: 'value', type: 'quantitative', grid:false, "scale": {"domain": [0.5,1.4]}},
      //text: {value: 'h'},
      row: { name: 'formula', domain: formulae_not_inputs.filter(d => d != "scale") },
      color: { name: 'formula', legend: false }
    },
    width:width-150, // messy !!! container width works but overstates
    height: 50,
    spec_post_process: spec => {spec.encoding.text = {value: '🎵'};
    spec.encoding.size = {"value": 10, "condition": {"test": "datum.beat_in == " + beat_in, "value": 30}};
    /*spec.width = "container";*/ spec.background='rgba(0,0,0,0)'; return spec}
  }))
  return result
    })}
    ${resize(width => {
      const result = embed('#viz2', calcuvizspec({
    models: [model],
    input_cursors: [{}],
    mark: {type:'text', point: false, clip:false},
    encodings: {
      x: { name: 'beat_in', type: 'quantitative', grid:false, domain: _.range(Math.max(beat_in,0),beat_in+40,1), scale: {zero: false, "domain": [beat_in-0.5,beat_in+40]} },
      //text: {name: 'value'},
      y: { name: 'note', type:'ordinal', independent:true },
      row: { name: 'scale', type:'ordinal' },
      color: { name: 'scale', type:'nominal', legend: false },
    },
    width:width-150, // messy !!! container width works but overstates
    height: 50,
    spec_post_process: spec => {spec.background='rgba(0,0,0,0)';spec.encoding.text = {value: '♪'};spec.encoding.size = {value: 20}; return spec}
  }))
  return result
    })
  }
  </div>
  </div>
</div>


```js

const esm = compile(cul).code
const introspection = introspection2(cul)
display(introspection.cul_input_map)
display(introspection)

const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

display(Object.values(introspection.cul_functions))
display([...introspection.cul_functions.values()])

const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)
display(formulae_not_inputs)


const model = await import(URL.createObjectURL(new Blob([esm], { type: "text/javascript" })).toString())

//display(model)


```


```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/calcs.cul.js').text()

import { calcuvizspec } from "../components/helpers.js"

import { compile, introspection2 } from "../components/mini-calculang.js"
```


```js
import embed from 'npm:vega-embed';

const n_in_Input = Inputs.input(8);
const n_in = Generators.input(n_in_Input);
const radius_in_Input = Inputs.input(7);
const radius_in = Generators.input(radius_in_Input);

const toggle_Input = Inputs.input("cul");
const toggle = Generators.input(toggle_Input);

// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(`export const beat = () => beat_in; // beat is an input

export const E5 = () => 1;
//export const C4 = () => 0;

export const note0 = () => String.fromCharCode(65 + (beat() % 7));
export const note = () => (note0() == 'B' ? 'D' : note0()) + scale();
export const scale = () => (2 + Math.floor((beat() / 7) % 4)) // is it?

export const chord0 = () => beat() % 14 == 0;
export const chord1 = () => beat() % (7 * 4) == 16;
export const chord2 = () => beat() % (7 * 4) == 18;
export const chord3 = () => beat() % (7 * 4) == 20;
`);
const cul = Generators.input(cul_Input);

```

```js
{
  if (model.note /* to tolerate deletion */) synth.triggerAttackRelease(model.note({beat_in}), '4n');
  if (model.C4 && model.C4({beat_in})) synth.triggerAttackRelease("C4", "8n")
  if (model.E5 && model.E5({beat_in})) synth.triggerAttackRelease("E5", "8n")
  if (model?.chord0({beat_in})) synth.triggerAttackRelease(['G3', 'E4', 'C5'], '1n');
  if (model.chord1({beat_in})) synth.triggerAttackRelease(['G4', 'C6', 'B5'], '4n');
  if (model.chord2({beat_in})) synth.triggerAttackRelease(['G4', 'C6', 'A6'], '4n');
  if (model.chord3({beat_in})) synth.triggerAttackRelease(['A4', 'C6', 'E5'], '16n');
}


```

```js
// from https://observablehq.com/framework/lib/vega-lite
// because embed doesn't work? (=> no tooltips)
/*import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);*/
```