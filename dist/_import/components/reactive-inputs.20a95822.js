import {html} from "../../_npm/htl@0.3.1/_esm.js";

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
  const narr = [...n]

  // init/create new inputs
  for (let i of narr) {
    const exits = document.querySelectorAll('.flashout#'+i).forEach(d => d.remove()) // bad code but reclaim old slot rather than keep dupes in dom (with same id=will break things)
    if (first || !o.has(i)) { // misses already-removed elements => use dom?
      let s = document.createElement('div');
      s.id = i
      s.classList.add('flash','input')
      //s.textContent = i
      const b = minibinds[i] || html`${i} <input type=number step="any" placeholder=${i} value=${(cursor.value[i] != undefined) ? cursor.value[i] : model[i.slice(0,-3)]({})}>`//html`${i} <input type=number onchange=${(e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}}} placeholder=${i} value=${(cursor.value[i] != undefined) ? cursor.value[i] : model[i[0].slice(0,-3)]({})}>`
      //if (b) {
        b.value = (cursor.value[i] != undefined /* need to capture 0s! */) ? cursor.value[i] : model[i.slice(0,-3)]({})
      //} else {
        b.oninput = (e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}; cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true}) }
        b.onchange = (e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}; cursor.dispatchEvent(new CustomEvent("change"), {bubbles:true}) }
        //b.onchange = (e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}}
      s.appendChild(b)
      //s.appendChild()
      //s.appendChild(Inputs.range([0,1],{}))
      el.appendChild(s)
      //cursor.value = {[i]: model[i.slice(0,-3)]({}), ...cursor.value, }
      if (i == narr.at(-1)) { cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true}); cursor.dispatchEvent(new CustomEvent("change"), {bubbles:true})}
    }
  }
  for (let i of o) {
    if (!n.has(i)) {
      let s = document.querySelector('#'+i)
      s.className = ''
      s.className = 'flashout' // TODO classList
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
  // infinite loop: altering a thing thats an input ...
  //cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true})
}





// cursor is an Input element
export const upF = function (el, selected_formulae, formulae_not_inputs) { 
  console.log('upF called')
  let first = false;
  if (el.dataset.formulae == undefined) {
    el.dataset.formulae = formulae_not_inputs.join(",");
    first = true;
  }
  const o = new Set(el.dataset.formulae.split(',').filter(d => d != ''));
  const n = new Set(formulae_not_inputs)

  // init/create new inputs
  for (let i of n) {
    const exits = document.querySelectorAll('.flashout#'+i).forEach(d => d.remove()) // bad code but reclaim old slot rather than keep dupes in dom (with same id=will break things)
    if (first || !o.has(i)) { // misses already-removed elements => use dom?
      let s = document.createElement('label');
      s.id = i
      s.classList.add('flash','formula')
      s.textContent = i
      const b = html`<input type=checkbox>`//html`${i} <input type=number onchange=${(e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}}} placeholder=${i} value=${(cursor.value[i] != undefined) ? cursor.value[i] : model[i[0].slice(0,-3)]({})}>`
      //if (b) {
        b.checked = (selected_formulae.value[i] != undefined /* need to capture 0s! */) ? selected_formulae.value[i] : true
      //} else {
      b.oninput = (e) => { selected_formulae.value = {...selected_formulae.value, [i]: (e.target.checked)}; selected_formulae.dispatchEvent(new CustomEvent("input"), {bubbles:true}) }
      //b.onchange = (e) => {cursor.value = {...cursor.value, [i]: (+e.target.value)}}
      s.appendChild(b)
      //s.appendChild()
      //s.appendChild(Inputs.range([0,1],{}))
      el.appendChild(s)
      s.appendChild(document.createElement('br'))
      selected_formulae.value = {[i]: true, ...selected_formulae.value, }
      selected_formulae.dispatchEvent(new CustomEvent("input"), {bubbles:true})
    }
  }
  for (let i of o) {
    if (!n.has(i)) {
      let s = document.querySelector('#'+i) // POSSIBILITY of overlap ???
      s.className = ''
      s.className = 'flashout'
      const {[i]: _, ...rest} = selected_formulae.value;
      selected_formulae.value = rest
      selected_formulae.dispatchEvent(new CustomEvent("input"), {bubbles:true})
      //el.removeChild(s)
    } else {
      // update value to cursor value
      //document.querySelector('#'+i+' input').value = +selected_formulae.value[i]
    }
  }
  console.log('oldF', o)
  console.log('newF', n)
  el.dataset.formulae = formulae_not_inputs.join(",")
  //cursor.dispatchEvent(new CustomEvent("input"), {bubbles:true})
}