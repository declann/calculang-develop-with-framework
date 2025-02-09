// https://observablehq.com/@declann/little-calculang-helpers
// copied at feb 15 24

// AWFUL, led to multiple unstable invalid module errors
//import {require} from "npm:d3-require";

import * as tidy from "../../_npm/@tidyjs/tidy@2.5.2/9a1a3f2b.js"

// invalid module error some times ?!?!
//let tidy = await require("@tidyjs/tidy@2.5.1/dist/umd/tidy.min.js")

//cql = require('compassql')

import * as cql from "../../_npm/compassql@0.21.2/e348eafb.js";


//export const a = () => {console.log(tidy, cql)}






// https://stackoverflow.com/questions/18957972/cartesian-product-of-objects-in-javascript
export const cartesianProduct = (input, current) => {
  if (!input || !input.length) { return []; }

  var head = input[0];
  var tail = input.slice(1);
  var output = [];

   for (var key in head) {
     for (var i = 0; i < head[key].length; i++) {
           var newCurrent = copy(current);         
           newCurrent[key] = head[key][i];
           if (tail.length) {
                var productOfTail = 
                        cartesianProduct(tail, newCurrent);
                output = output.concat(productOfTail);
           } else output.push(newCurrent);
      }
    }    
   return output;
}



// https://stackoverflow.com/questions/18957972/cartesian-product-of-objects-in-javascript

function copy(obj) {
  var res = {};
  for (var p in obj) res[p] = obj[p];
  return res;
}



// cursor takes priority over domain, but
// this api has no concept that some domains not mapped
// so combinatorial explosion happens if not used carefully
// (be deliberate about domains provided!)
export const calcudata = ({
  models,
  introspections = [] /*now not needed, see TODOs*/,
  input_domains /*Bug should be array*/,
  input_cursors,
  outputs,
  pivot = false
}) => {
  if (!models.length) return;
  // we populate an object for a cartesian product across: models, cursors and output formulae...
  let object_for_cp = {
    model_id: models.map((_, i) => i),
    input_cursor_id: input_cursors.map((_, i) => i),
    formula: outputs
  };

  // and input domains (permits overwriting model_id, input_cursor_id domains):
  Object.entries(input_domains).forEach(([k, v]) => {
    object_for_cp[k] = v;
  });

  //return Object.entries(object_for_cp).map(([k,v]) => ({[k]:v}))
  // do the cartesian product:
  let cp = cartesianProduct(
    Object.entries(object_for_cp).map(([k, v]) => ({ [k]: v }))
  ); // cartesianProduct wants a funny array structure

  // complete inputs model needs by adding inputs from the cursor:
  cp = cp.map((d) => ({ ...d, ...input_cursors[d.input_cursor_id] })); // TODO no overlap/error checking here. ~~pref to domains, not inputs~~ now pref to inputs 4/3/24

  // now we run the model:
  //cp = cp.map(d => ({...d, value: models[d.model_id][d.formula](d)})) // no resriction to necessary inputs formula-specific or not TODO? +pushing some unnecessary fields to model... problem?
  let o = [];
  cp.forEach((d) => {
    let ans = "ERROR";
    try {
      ans = /*+*/ models[d.model_id][d.formula](d);
    } catch (e) {
      console.log(e);
    }
    let e = {};
    Object.entries(d).forEach(([k, v]) => {
      //console.log("hi", k, v);
      if (input_cursors[0][k] == undefined) e[k] = v;
    });
    e.formula = d.formula;
    o.push({ ...e, value: ans /*, data_table_in: null*/ });
  });

  // log to console, FUT: report to browser extension
  console.log("the following numbers returned by calcudata helper fn:");
  console.log(o);

  // optional pivot, done
  if (pivot)// console.error('DECLAN REMOVED THIS')
    return tidy.tidy(
      o,
      tidy.pivotWider({ namesFrom: "formula", valuesFrom: "value" })
    );
  return o;
}


// todo hierarchys...
// for now don't use input_domains

export const calcuvizspec = ({
  models,
  introspections = [],
  /*input_domains*/ /*?? better to just specify in encodings, application can take care of structure?,*/ input_cursors,
  mark,
  encodings,
  width,
  height,
  spec_post_process = (spec) => spec
}) => {
  // encodings map visual channels to inputs or specified formulae or special ids model_id, cursor_id, and 'formulae'

  // depending on the encodings there are 2 types of chart:
  // 1. 'formulae' used, incompatible with mapping individual formulas to channels. 'value' must be mapped. (e.g. table of formulae over some input)
  // 2. individual formulae mapped to channels. Incompatible with 'value' being mapped. (e.g. a scatter plot such as bounce animation)

  // structure of the data we need to visualise differs b/w 1 and 2. pivot should be true for 2, false for 1
  // we infer this here and structure the right call to calcudata. The right call to CompassQL takes care of the rest: outputting a vega-lite spec.

  // missing: 'detail_only_proj'

  if (!models.length) return;

  let encodings_for_cql = Object.entries(encodings)
    .filter(([k, v]) => k != "detail_only_proj")
    .map(([k, v]) => ({
      type: v.type ?? "nominal",
      channel: k,
      field: v.name ?? v
    })); // is shorthand redundant due to domains requirement? No, use for specified formulae

  // input domains (formulae in encodings not relevant)
  let input_domains = {};
  let input_domains2 = Object.values(encodings).filter(
    ({ name }) => name == "formulae" || name.substr(-3) == "_in"
  );
  input_domains2.forEach(({ name, domain }) => {
    input_domains[name] = domain;
  }); // follow from encodings names

  //.map(({name, domain}) => ({[name]:domain}))

  // outputs should depend on specified formulae, or domain of 'formulae', other?
  let outputs = [
    /*specified formulae mapped to channels*/ ...Object.values(encodings)
      .map((d) => d.name)
      .filter(
        (name) =>
          name != "formula" &&
          name != "value" &&
          name != "input_cursor_id" &&
          name.substr(-3) != "_in"
      ) /*'formula' with domains mapped to channels*/
  ];

  let outputs2 = Object.values(encodings)
    .filter(({ name }) => name == "formula")
    .map((d) => d.domain);
  if (outputs2.length) outputs = [...outputs, ...outputs2[0]];
  //return outputs2

  //return outputs

  let data = calcudata({
    models,
    introspections,
    input_domains,
    input_cursors,
    outputs,
    pivot:
      Object.values(encodings).filter((d) => d.name == "formula").length == 0
  });

  /*return ({
    models,
    introspections,
    input_domains,
    input_cursors,
    outputs,
    pivot:true
  })*/

  let schema = cql.schema.build(data);

  //return encodings_for_cql

  let cql_output = cql.recommend(
    {
      spec: {
        data,
        mark, // bar/line override?
        encodings: encodings_for_cql
      },
      chooseBy: "effectiveness"
    },
    schema
  );

  let vlTree = cql.result.mapLeaves(cql_output.result, function (item) {
    return item; //.toSpec();
  });

  let c_spec = vlTree.items[0].toSpec();

  //return c_spec // done ! todo bring some customizations together

  c_spec.data = { name: "data" };
  //s.width = /*viz.width ??*/ 500;
  //s.height = spec.height;
  c_spec.datasets = { data /*.filter(d => d.y>-100)*/ };
  //var r = {}
  // todo independent scales Object.entries(viz_spec.independent_scales).filter(([k,v]) => v == true).forEach(([k,v]) => { r[k] = 'independent' })
  //s.resolve = {scale: r}
  /// NEEDED? if (spec.mark == "bar") s.mark = "bar"; //{"type": "bar", "tooltip": true};
  if (typeof mark === "string") mark = { type: mark, tooltip: true };
  else if (mark.tooltip == undefined) mark.tooltip = true;
  c_spec.mark = mark; //{type: mark, tooltip:true}
  //if (spec.mark == "line") {s.mark.point = true; s.encoding.order={field:spec.channels.detail_only_proj}/*s.encoding.size = {value:20}*/}
  //if (spec.mark == "point") {s.encoding.size = {value:100};
  //s.mark.strokeWidth = 5};

  //s["config"] ={"legend": {"disable": true}}

  //s['encoding']['x']['axis']['labelAngle'] = 0 //.x.axis.labelAngle=0// = {"orient": "top", "labelAngle":0};

  if (width) c_spec.width = width;
  if (height) c_spec.height = height;
  if (encodings.x?.name == "formula")
    c_spec.encoding.x.axis = { labelAngle: 0, orient: "top", labelLimit: 90 };
  if (encodings.row?.name == "formula")
    c_spec.encoding.row.header = { labelLimit: 70 };
  // TODO allow for interactions of options below!
  Object.entries(encodings).forEach(([v, e]) => {
    if (e.format) {
      c_spec.encoding[v].format = e.format;
      if (c_spec.encoding[v].axis == undefined)
        c_spec.encoding[v].axis = { format: e.format };
    }
    if (e.scale) c_spec.encoding[v].scale = e.scale;
    if (e.sort) c_spec.encoding[v].sort = e.sort;
    if (e.zero != undefined) c_spec.encoding[v].scale = { zero: e.zero };
    if (e.nice != undefined) c_spec.encoding[v].scale = { nice: e.nice };
    if (e.grid != undefined) c_spec.encoding[v].axis = { grid: e.grid };
    if (e.legend == false) c_spec.config = { legend: { disable: true } };
    if (e.legend == null && e.legend != undefined)
      c_spec.encoding[v].legend = null; // replace above line if working?
    if (e.independent) c_spec.resolve = { scale: { [v]: "independent" } };
  });
  // optional legends?

  return spec_post_process(c_spec);
}