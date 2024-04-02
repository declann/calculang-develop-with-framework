---
title: Pi 🥮 by lattice
toc: false
---

# This CAN be more maintainable

# There are unusual "invalid module" errors

# And see FW issue [1192](https://github.com/observablehq/framework/issues/1192)


```js
import {Scrubber} from './components/scrubber.js'


```

<div id="wrapper" class="wrapper">
  <div id="content" class="rhs side">
  
<h1>🎨 Pi by lattice 🥮</h1>

  <div class="card">
    <details open><summary>inputs ⚙️</summary>
    ${view(Inputs.bind(Scrubber(_.range(2,76), {value: 10, delay: 1000/10, autoplay: false, alternate:false, loop:false,/*format:d => d3.format('.2f')(d)*/}), n_in_Input))}
    </details>
    </div>
  <span>Press <strong>play</strong> for an improving approximation of <strong>π</strong> based on approximating the area of a unit circle using a lattice!</span>
  <details style="background:lightgreen; padding: 0.5rem; margin: 0.5rem; border: 1px solid blue"><summary style="font-weight:bold">calculang 🔍💬🧮</summary>
  <span>This pi approximation is made with <a href="https://calculang.dev">calculang<a>, <span style="font-weight:bold">a language for calculations for transparency and certainty about numbers</span> 🔍💬🧮<br/>
  <p>On left/top, you can find and edit the formulas (but this is WIP and very dangerous).
  <p>Better to find the source code <a href="https://github.com/declann/calculang-develop-with-framework/">on GitHub</a> and PRs are welcome.</p>
  </details>
  <details style="padding: 0.5rem; margin: 0.5rem"><summary style="">inspiration 🧙</summary><p><a href="https://www.geogebra.org/m/kwty4hsz">A Geogebra example</a> I found linked in the <a href="https://www.geogebra.org/u/kmhkmh">wikipedia article for Pi</a>. I replicate this approach/numbers.</p>
  <p>Given this is similar but simpler than the <a href="https://observablehq.com/@declann/monte-carlo-pi?collection=@declann/calculang">Monte Carlo Pi</a> approximation I reproduced last year, I'm not sure why this approach isn't more common.</p>
  </details>
</span>
<span>Calculated area <strong>inside</strong> unit circle = ${model.proportion_inside({n_in}).toFixed(5)} units<sup>2</sup> (1 quadrant); *4 ⇒</span>
<h3>π ≈ ${model.pi_approximation({n_in}).toFixed(5)}</h3>
<span>⇒ error ≈ <span style="font-weight:bold;color:red">${model.error({n_in}).toFixed(5)}</span></span>
<span>(using πr<sup>2</sup> and r=1)</span>

<div class="card" id="viz"></div>

```js echo
const spec = ({//
  // vega-lite
  title: "points",
  mark: {type:'point', tooltip:true, filled:true},
  encoding: {
    x: { field: 'x', type: 'quantitative', scale: { domain: [0,1]} },
    y: { field: 'y', type: 'quantitative', scale: { domain: [0,1]}  },
    color: {field: 'inside', type: 'nominal', sort: 'descending'},
    detail: {field: 'i_in', type: 'nominal'},
  },
  data: { name: "data" },
  autosize: { "type": "fit", "contains": "padding"},
  width: Math.min(500,content_width-30),//Math.min(400,content_width),
  height: Math.min(500,content_width-30)/1.2,//Math.min(400,content_width-30),
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
    i_in: _.range(0,n_in*n_in)
  },
  input_cursors: [
    { n_in }
  ]
})
```

```js echo
viz.view.data("data", data_source)/*.resize()*/.run(); // turn off resize
```

<details><summary>📜</summary>

```js echo
const pis = [5, 10, 20,30,50,55,60,65,70,75]
  .map(n_in => ({n_in, pi_approximation: model.pi_approximation({ n_in}), proportion_inside: model.proportion_inside({ n_in}), error: model.error({ n_in})}))

display(Inputs.table(pis, {sort: 'n_in', reverse: true, format: { pi_approximation: d3.format(',.10f'), error: d3.format(',.4f') }}))
```

</details>

  <p><strong>⚠️ This π approximation is not suitable for space travel.</strong> For better approximations check my <a href="https://observablehq.com/@declann/its-pi-day">post from last year</a>. See also, separate approximation using <a href="https://observablehq.com/@declann/monte-carlo-pi?collection=@declann/calculang">Monte Carlo methods</a>.</p>
</div>
</div>

<!-- @include: /home/declan/MESSING/GitHub/calculang-develop-with-framework/docs/TEMPLATE.md -->





```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/pi-lattice.cul.js').text()

```


```js

const n_in_Input = Inputs.input(2);
const n_in = Generators.input(n_in_Input);

const content_width =400//Generators.width(document.getElementById("content")); // keep as a generator for reactivity


// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);

```
