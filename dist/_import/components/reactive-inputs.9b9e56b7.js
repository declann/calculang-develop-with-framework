import {html} from "../../_npm/htl@0.3.1/+esm.js";

// cursor is an Input element
export const up = function (el, cursor,inputs, model, minibinds) { // not reactive to inputs top-level: inputs refers to this argument
  console.log('up called')
  if (!model) { model = {}; const a = Object.values(inputs); a.forEach(d => {model[d.slice(0,-3)] = () => 1})}
  let first = false;
  if (el.dataset.inputs == undefined) {
    el.dataset.inputs = inputs.join(",");
    first = true;
  }
  const o = new Set(el.dataset.inputs.split(',').filter(d => d != ''));
  const n = new Set(inputs)

  // init/create new inputs
  for (let i of n) {
    const exits = document.querySelectorAll('.flashout#'+i).forEach(d => d.remove()) // bad code but reclaim old slot rather than keep dupes in dom (with same id=will break things)
    if (first || !o.has(i)) { // misses already-removed elements => use dom?
      let s = document.createElement('div');
      s.id = i
      s.className = 'flash'
      //s.textContent = i
      const b = minibinds[i] || html`${i} <input type=number step="any" placeholder=${i} value=${(cursor.value[i] != undefined) ? cursor.value[i] : model[i.slice(0,-3)]({})}>`//html`${i} <input type=number onchange=${(e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}}} placeholder=${i} value=${(cursor.value[i] != undefined) ? cursor.value[i] : model[i[0].slice(0,-3)]({})}>`
      //if (b) {
        b.value = (cursor.value[i] != undefined /* need to capture 0s! */) ? cursor.value[i] : model[i.slice(0,-3)]({})
      //} else {
      b.oninput = (e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}; cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true}) }
      //b.onchange = (e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}}
      s.appendChild(b)
      //s.appendChild()
      //s.appendChild(Inputs.range([0,1],{}))
      el.appendChild(s)
      cursor.value = {[i]: model[i.slice(0,-3)]({}), ...cursor.value, }
      cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true})
    }
  }
  for (let i of o) {
    if (!n.has(i)) {
      let s = document.querySelector('#'+i)
      s.className = ''
      s.className = 'flashout'
      const {[i]: _, ...rest} = cursor.value;
      cursor.value = rest
      cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true})
      //el.removeChild(s)
    } else {
      // update value to cursor value
      document.querySelector('#'+i+' input').value = +cursor.value[i]
    }
  }
  console.log('old', o)
  console.log('new', n)
  el.dataset.inputs = inputs.join(",")
  //cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true})
}