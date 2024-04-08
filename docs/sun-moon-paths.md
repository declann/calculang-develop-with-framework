---
title: ☀️ and 🌝 Paths (GALLERY DEV)
toc: false
---

<!-- @include: /home/declan/MESSING/GitHub/calculang-develop-with-framework/docs/TEMPLATE.md -->

<div id="content">

# Path of ☀️ and 🌝

Replicating sun/moon position calcs from [SunCalc](https://github.com/mourner/suncalc/tree/master); compare results by layering both models below!
  
<div class="card">
<details><summary>location 🌎 (default: Brú na Bóinne, Ireland)</summary>

```js
//import {location} from './components/location.js'
```

```js
//display(location({value: [14.420917, 50.087008], label: "Position"}))
```

```js echo
const lat_in = view(Inputs.range([-360,360], {label: 'latitude', value: 53.694712}))
const lng_in = view(Inputs.range([-360,360], {label: 'longitude', value: -6.475492}))

const clip1 = view(Inputs.toggle({value:true}))
const clip2 = view(Inputs.toggle())
```

*date below*

</details>
</div>


```js
import {addDays, addMinutes} from 'npm:date-fns'
//import {UTCDate} from 'npm:@date-fns/utc' // needed to add offset, allow for DST
```

```js
import * as dateFns from 'https://esm.run/date-fns';
```

```js
// updates to current date
const date_in = view(Inputs.date({label: "date", value: new Date()}))
```

<h3 style="margin-bottom:-20px">${d3.utcFormat("%B %d, %Y")(date_in)}</h3>

```js
const viz_placeholder = html`<div id="viz" class="card"></div>`

display(viz_placeholder)
```

```js
const model_option = view(Inputs.select(["calculang","suncalc","both (layered)"], {value:"calculang", label: 'models 👀',width:100}))
```

🚧 *even though I replicate numbers, I need to do some DST and other time-related thinking*

```js echo
const spec = ({
  // vega-lite
  mark: {type:'point', size:400, filled:true,tooltip:true, clip:false, strokeWidth:0.2},
  //transform: [{calculate: 'datum.obj_in == "moon" ? (datum.eclipse_guestimate < 0.005 ? "🌚" : "🌝") : "☀️"', as: 'annotation'},{calculate: 'datum.eclipse_guestimate < 0.0016 ? true : false', as: 'eclipse'}],
  encoding: {
    stroke: {field:'obj_in'},
    strokeWidth: {value: 2},
    strokeOpacity: {value:200},
    opacity: {value: 0.8},
    size: {value: 150},
    y: {grid: false,field: 'altitude_obj', type:'quantitative', axis: { values: [0,1], title: 'altitude (rads)'}, scale: {ticks: [0],zero: false, domain: clip2 ? [0,1] : [-1,1.5]}},
    x: {grid:false,field: 'azimuth_obj', type: 'quantitative', axis: {title: 'azimuth (rads)'}, scale: {zero: false, domain: !clip2 ? [-3,3] : [-0.5,2.5]}},
    shape: {field: 'model_id'},
    order: {field: 'model_id', sort:'descending'},
    color: {field: 'time_in', sort:'ascending', type: 'quantitative', timeUnit: 'hoursminutes', legend:false, scale: {scheme: 'lightmulti'}
    }
  },
  background: '#00000000',
  width:500*.8 * (clip1 ? 1 : 0.5),
  height:400*.6 * (clip1 ? 1 : 0.5),
  data: { name: "data" },
})

// interactivity via vega signals and listeners
const viz = embed('#viz', spec, {actions:true})
```


```js echo
const data_source = calcuvegadata({
  models: model_option == 'calculang' ? [model] : model_option.includes('both') ? [model, suncalc_js_wrapped] : [suncalc_js_wrapped],
  spec,
  domains: {
    obj_in: ['sun','moon'],
    date_in: [date_in],
    // all days (for analemma)
    //date_in: [new Date(),new Date(),new Date(),new Date(),new Date(),new Date(),new Date(),new Date(), ..._.range(0,365+1, 5).map(d => addDays(date_in, d))/*, ..._.range(1,121).map(d => addDays(date_in, -d))*/],//[new Date()],//[new Date(),new Date(),new Date(),new Date(),new Date(),new Date(),new Date(),new Date(), ..._.range(0,365+1, 5).map(d => addDays(date_in, d))/*, ..._.range(1,121).map(d => addDays(date_in, -d))*/],
    time_in: _.range(0,25.1,1).map(hrs => addMinutes(date_in, hrs*60))
  },
  input_cursors: [
    { lat_in, lng_in, date_in }
  ]
})
```

```js echo
viz.view.data("data", data_source)/*.resize()*/.run();
```

*SunCalc wrapper for comparisons:*

```js echo
// wrapper around SunCalc: the JS model by Vladimir Agafonkin I replicate
// which itself is bassed on Astronomy Answers formulae: https://aa.quae.nl/en/reken/hemelpositie.html

// wrapper allows me to call it consistent with calculang model
// so I can layer onto the same visual
// to check calculang numbers/progress

// the JS model is suncalc_js_wrapped
// the calculang model is simply model, as in other examples

import {default as SunCalc} from 'npm:suncalc'

const suncalc_js_wrapped = {
  time_composed: ({date_in, time_in}) => new Date(date_in.getFullYear(), date_in.getMonth(), date_in.getDate(), time_in.getHours(), time_in.getMinutes(), time_in.getSeconds()),

  altitude_obj: ({obj_in, date_in, time_in, lat_in, lng_in }) => {
    const time_composed = suncalc_js_wrapped.time_composed({date_in,time_in});

    if (obj_in == 'sun') return SunCalc.getPosition(time_composed, lat_in, lng_in).altitude
    else return SunCalc.getMoonPosition(time_composed, lat_in, lng_in).altitude
  },

  azimuth_obj: ({obj_in, time_in, lat_in, lng_in }) => {
    const time_composed = suncalc_js_wrapped.time_composed({date_in,time_in});

    if (obj_in == 'sun') return SunCalc.getPosition(time_composed, lat_in, lng_in).azimuth
    else return SunCalc.getMoonPosition(time_composed, lat_in, lng_in).azimuth
  },
}
```

</div>
</div>


</div><!-- close tag started in template -->

```js
import {FileAttachment} from "npm:@observablehq/stdlib";

const cul_default = await FileAttachment('./cul/suncalc.cul.js').text()
```

```js
// https://github.com/observablehq/framework/issues/1194
//const content_width = Generators.width(document.getElementById("content2")); // keep as a generator for reactivity


// circular definition if I use cul_default ?!
const cul_Input = Inputs.input(cul_default);
const cul = Generators.input(cul_Input);
```
