// https://observablehq.com/d/baafa4b071a5b66a
// @ 27/2/24

import * as traverseObj from "../../_npm/object-traversal@1.0.1/+esm.js";
import {uniq} from "../../_npm/underscore@1.13.6/+esm.js";
import { calcudata } from "./helpers.114a7fce.js";

export const a = () => {
  console.log('traverseObj', traverseObj)
}

export const mappings = (spec) => {
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

export const calcuvegadata = ({ models, spec, domains, input_cursors }) => {
  //debugger
  if (!models.length) return;
  let mapped = mappings(spec),
    outputs,
    pivot;

  if (mapped.includes("value")) {
    outputs = domains.formula;
    pivot = false;
  } else {
    outputs = mappings(spec)
      .filter((d) => d.slice(-3) != "_in") // move this into mappings?
      .filter((d) => models[0][d] != undefined);
    pivot = true;
  }

  //let c = {}

  //console.log(models, domains, input_cursors, outputs, pivot);
  return calcudata({
    models,
    // restrict domains passed to calcudata to those that are used (mapped)
    input_domains: Object.entries(domains).reduce((acc, [k,v]) => {if (mapped.includes(k)) acc[k] = v; return acc}, ({})),//domains,
    input_cursors: input_cursors.map((d) => {
      let o = {};
      Object.entries(d).forEach(([k, v]) => {
        if (!mapped.includes(k)) o[k] = v;
      });
      return o;
    }), // filter out mapped? TODO
    outputs,
    pivot
  });
}