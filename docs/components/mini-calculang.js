// from editable-flowers

//const babel = require('@babel/standalone')

//https://unpkg.com/@babel/standalone/babel.min.js
import {require} from "npm:d3-require";

//import * as Babel from 'https://unpkg.com/@babel/standalone/babel.js';
const Babel = await require("@babel/standalone")


//console.log('hello', babel)

// Framework-only


import * as G from 'npm:@dagrejs/graphlib'
//const G = await require("@dagrejs/graphlib")
const alg = G.alg;

export const introspection2 = (input) => {
  // from calculang-js f5fc27a961bb209f1e86be2abf868d7979a46f60

  let introspection = {
      cul_functions: new Map(), // map of <cul_scope_id>_<name> -> {cul_scope_id, name, inputs (array), cul_source_scope_id, reason=definition|definition (renamed)|input definition|explicit import}
      cul_links: new Set(), // calls, imports, renames go here: Set of { to, from, reason=call|explicit import|implicit import }
      cul_scope_id_counter: 0,
      cul_parent_scope_id: 0,
      location: [],
      cul_scope_ids_to_resource: new Map(), // BUG this is used for inheritence logic ('implicit imports') & the same relative path is always used. It should depend on both the location of fn and where import goes, todo fix and dont want to trigger a circular compile ... fix later
      // alt. fix: always keep from parent? (old idea)
      import_sources_to_resource: new Map(),
    cul_input_map: {}//new Map()
    },
    parentfn,
    parentfnOrig;

  Babel.transform(input, {
    //presets: ["es2015", "react"],
    //generatorOpts: { /*compact: true*/ retainLines: true },
    //ast: true,
    plugins: [
      [
        {
          visitor: {
            Program: {
              enter(path, state) {
                //introspection.push("hello");
              }
            },
            Function: {
              enter(path, { opts, ...state }) {
                // mini-only:
                if (!opts.cul_scope_id) opts.cul_scope_id = 0;

                // TODO ignore annon fns ?

                var name = path.parent.id?.name;
                if (name == undefined) return; // not an arrow fn, but esp. not annon. TODO more complete allowances
                var reason = "definition";

                parentfn = name || "bug_name";
                parentfnOrig = name || "bug_name";

                // rename already-scoped definitions (already merged from a parent scope) : apply _ modifier
                if (
                  introspection.cul_functions.get(
                    `${opts.cul_scope_id}_${name}`
                  )
                ) {
                  path.parent.id.name += "_";
                  parentfn += "_"; // update this one, not Orig
                  reason = "definition (renamed)"; // do this even when implicit import was blocked? or where E explicit import in parent for _

                  // now references to the function need to be updated
                  [...introspection.cul_functions.values()]
                    .filter(
                      (d) =>
                        d.imported /* I need imported here */ == name &&
                        d.reason.indexOf("explicit import") != -1 && // function is imported explicitly
                        d.cul_scope_id == opts.cul_parent_scope_id && // new, post-working/tests
                        d.cul_source_scope_id == opts.cul_scope_id // Nov 2023 #117
                    )
                    .forEach((d) => {
                      introspection.cul_functions.set(
                        `${d.cul_scope_id}_${d.name}`,
                        {
                          ...d,
                          imported: d.imported + "_" // here. Only do this when?
                        }
                      );
                      introspection.cul_links.forEach((dd) => {
                        if (
                          dd.to == `${d.cul_scope_id}_${d.name}` &&
                          dd.reason == "explicit import" // -> indexOf?
                        ) {
                          dd.from += "_"; // add (renamed)?
                          dd.reason += " (renamed)";
                        }
                      });
                    }); // do I need local and imported in cul_functions? Yes: for now just set imported (name=>local)
                }

                // create definition
                introspection.cul_functions.set(
                  `${opts.cul_scope_id}_${path.parent.id.name}`,
                  {
                    cul_scope_id: opts.cul_scope_id,
                    name: path.parent.id.name,
                    cul_source_scope_id: opts.cul_scope_id,
                    reason,
                    loc: path.node.loc
                  }
                );
              },
              exit() {
                parentfn = undefined;
                parentfnOrig = undefined;
              }
            },

            // convention to define e.g. an input called time is `export const time = () => time_in`
            // time_in is an identifier and input logic is below:
            Identifier(path, state) {
              // mini-only:
              if (!state.opts.cul_scope_id) state.opts.cul_scope_id = 0;

              // use original parentfn to match only, so inputs coded always coded as X = () => (X_in) even if X renamed to X_ due to override
              // I think this is sensible; you wouldn't hook such a formula into model unless you wanted the input (if not hooked up no impact as input will flow to no nodes)
              if (path.node.name == `${parentfnOrig}_in`) {
                // create input definition
                introspection.cul_functions.set(
                  `${state.opts.cul_scope_id}_${path.node.name}`, // TODO: can remove scope concept for input definitions? May have dupes, but dupes not feeding into 1 model (I think)
                  {
                    cul_scope_id: state.opts.cul_scope_id,
                    name: path.node.name, // units_in
                    cul_source_scope_id: state.opts.cul_scope_id,
                    reason: "input definition"
                  }
                );
                // and create link
                var link = {
                  to: `${state.opts.cul_scope_id}_${parentfn}`,
                  from: `${state.opts.cul_scope_id}_${path.node.name}`,
                  reason: "input"
                };
                // don't include dupes of inputs, just for more readable graphs (e.g. goalseek case)
                // doesn't work, see https://stackoverflow.com/questions/29759480/how-to-customize-object-equality-for-javascript-set
                //if (!introspection.cul_links.has(link)) introspection.cul_links.add(link);
                // inefficient but quick alt.
                if (
                  [...introspection.cul_links]
                    .map((d) => JSON.stringify(d))
                    .indexOf(JSON.stringify(link)) == -1
                )
                  introspection.cul_links.add(link);
              }
            },
            CallExpression(path, state) {
              // mini only
              if (!state.opts.cul_scope_id) state.opts.cul_scope_id = 0;
              // BUG ? getting multiple links in set for individual calls. These differ when negs differ
              // does neg logic need to apply over all?
              // i.e. some dupe links in graph that are invisible

              // cul calls never have >1 argument
              if (path.node.arguments?.length > 1) return;
              // if cul calls have 1 argument, its an ObjectExpression
              if (
                path.node.arguments?.length == 1 &&
                path.node.arguments[0].type != "ObjectExpression"
              )
                return; // result.push({obj}) doesn't return....

              // TODO edge cases: the ultimate criteria: cul calls always have a definition in scope at this point? but do they: all Functions probably not done?
              // or OK because a JS call won't have any impact? At least Rewriter can tell its not a cul call ('to' in link won't exist - any other issue caused? No issue. No node/node doesn't have cul scope info attached; graphlib/dot writer creates an empty node assocd. with link)
              // TODO rewriter:

              // TODO clean up this mess of guards...
              // TODO do not neg parentfn_in e.g. for goalseek purposes vs. put this exception in rewriter?
              var negs;
              if (
                path.node.arguments == undefined ||
                path.node.arguments[0] == undefined
              )
                negs = [];
              else
                negs =
                  path.node.arguments[0].properties?.map((d) => d.key.name) ||
                  [];

              // pupulate negs from _ins defined in JS scope e.g. [10,11].map(price_in => { price_in, revenue()})) : price_in is a neg to revenue call if revenue depends on it
              negs = negs.concat(
                Object.keys(path.scope.getAllBindings()).filter((d) =>
                  /_in?$/.test(d)
                )
              ); // push defined _ins in scope (no filter for dependence)

              introspection.cul_links.add({
                to: `${state.opts.cul_scope_id}_${parentfn}`,
                from: `${state.opts.cul_scope_id}_${path.node.callee.name}`, // TODO develop logic for method calls (console.log=undefined) result.push({obj}) ignore
                reason: "call",
                negs,
                loc: path.node.loc
              });
            }
          }
        }
      ]
    ]
  });

  // TODO graph processing here

  var g = new G.Graph({ multigraph: true });
  var g1 = new G.Graph({ multigraph: true });

  // create nodes: node for each cul_definition
  introspection.cul_functions.forEach((value, key) => {
    g.setNode(key, { ...value, label: `${key}` });
    g1.setNode(key, { ...value, label: `${key}` });
  });

  // set edges
  introspection.cul_links.forEach((value) => {
    if (!introspection.cul_functions.has(value.from)) return; // Array.push({}) has in cul_links as 0_undefined
    g.setEdge(value.from, value.to, {
      value,
      label:
        value.reason +
        (value.negs ? " -" + value.negs.toString() : "") +
        (value.reason == "input"
          ? " +" + introspection.cul_functions.get(value.from).name
          : "")
    });
    g1.setEdge(value.to, value.from, {
      value,
      label:
        value.reason +
        (value.negs ? " -" + value.negs.toString() : "") +
        (value.reason == "input"
          ? " +" + introspection.cul_functions.get(value.from).name
          : "")
    });
  });

  /*alg.postorder(g1, g.nodes()); // this ordering (on g1) ensures all inputs ordered before each node (all nodes included)
      alg.postorder(g1, g.nodes()).map((d) => ({
        d,
        ss: g1.successors(d).toString(),
      }));*/

  [...introspection.cul_functions.entries()]
    //.filter(([k, d]) => d.reason != 'input definition')
    .forEach(([k, d]) => {
      var a = alg;
      introspection.cul_input_map[k] =
        new Set(
          alg
            .postorder(g1, k)
            .filter((d) => g.node(d)?.reason == "input definition") // non JS has no reason e.g. reporting Table, but get excluded. Could lookup cul_functions)
            .map((d) => g.node(d).name)
        )
      ;
    });

  // e.g. price_my_fave_product = () => price({product_in:'mate'}), while another call to price might indicate a dependence on product, this particular call doesn't, and *without any other calls* then price_my_fave_product should not be dependent on product
  // I call this a 'neg' in terms of the call. Logic below figures about dependence impacts via graph logic
  // cul_input_map updated directly below
  var edges_with_negs = g
    .edges()
    .map((d) => g.edge(d))
    .filter((d) => d.value.negs?.length > 0);

  edges_with_negs.forEach((edge) => {
    edge.value.negs.forEach((neg_in) => {
      var other_edges = g
        .inEdges(edge.value.to)
        .map((d) => g.edge(d))
        .filter((d) => JSON.stringify(d) != JSON.stringify(edge)); // filter out edge
      // can this forEach() be an every() with a break when a neg is needed? Also s.t. better than stringify?
      alg.preorder(g, edge.value.to).forEach((d) => {
        other_edges = g
          .inEdges(d)
          .map((d) => g.edge(d))
          .filter((d) => JSON.stringify(d) != JSON.stringify(edge))
          .filter((d) => !d.value.negs?.includes(neg_in));

        //(gg.inEdges(d).map(d => g.edge(d))

        //if (gg.inEdges(d).filter(d => g.edge(d).value.reason == 'call').map(d => g.edge(d).value.negs).reduce((a,v) => ([...a,...v]), []).includes(neg_in))
        // does another path include the neg_in?

        var result = g
          .successors(d)
          .filter((d) => d != edge.value.from /* filter out the negged one */)
          .map((d) => introspection.cul_input_map[d])
          .reduce((a, v) => [...a, ...v], [])
          .includes(neg_in);

        result = other_edges
          .map((d) => introspection.cul_input_map[d.value.from])
          .reduce((a, v) => [...a, ...v], [])
          .includes(neg_in);

        if (!result) introspection.cul_input_map[d].delete(neg_in);
      });
    });
  });

  // based on cul_input_map, add inputs into cul_functions)
  [...introspection.cul_functions.entries()].map(([k, v]) => [
    k,
    {
      ...v,
      inputs: introspection.cul_input_map[k]
        ? [...introspection.cul_input_map[k]]
        : []
    }
  ]);

  return introspection;
}



// a quick hack
export const compileWithMemo = input => {
  let introspection = introspection2(input);

  console.log("introspection", introspection)

  const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()

  const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d != "memo_hash" && d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)

  const has_memo_hash = introspection.cul_functions.has("0_memo_hash")

  console.log("formulae_not_inputs", formulae_not_inputs)

  let a = input; // chk using https://github.com/rsms/js-lru/tree/master

  formulae_not_inputs.forEach(d => {
    a = a.replaceAll(' ' + d + ' =', ' ' + d+ '$=') // conserve positions hack !
  })

  //a += "import {memoize} from 'https://cdn.jsdelivr.net/npm/underscore/+esm'//'https://esm.run/underscore';\n\n"

  a = a + formulae_not_inputs.map(d => `\n// memoization\n\nexport const ${d}$m = memoize(${d}$, ${has_memo_hash ? "memo_hash$" : "JSON.stringify"});\nexport const ${d} = (a) => {
    return ${d}$m(a);
    // eslint-disable-next-line no-undef
    ${d}$(); // never run, but here to "trick" calculang graph logic
  };\n\n`).join('')

  //console.log("NEW", a)

  let out = compile(a)

  return {...out, code: out.code + `

  // from https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-esm.js

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Internal function to check whether \`key\` is an own property name of \`obj\`.
function has$1(obj, key) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}


`}


  // import {memoize} from 'https://esm.run/underscore';
  /// rest with replacement defn names => add $
  // 
  /*export const red$m = memoize(red$, JSON.stringify);
export const red = (a) => {
  return red$m(a);
  // eslint-disable-next-line no-undef
  red$(); // never run, but here to "trick" calculang graph logic
};*/

}


// from calculang-js f5fc27a961bb209f1e86be2abf868d7979a46f60

export const compile = (input) => {
  let introspectionA = introspection2(input);
  //return;
  let parentfn = "",
    parentfnOrig = "";
  return Babel.transform(input, {
    //presets: ["es2015", "react"],
    generatorOpts: { /*compact: true*/ retainLines: true },
    sourceMaps: true,
    plugins: [
      [
        ({ types: t }) => ({
          visitor: {
            Program: {
              enter(path, state) {
                console.log(t);
                //introspection.push("hello");
              }
            },
            Function(path, state) {
              // mini only
              if (!introspectionA.params)
                introspectionA.params = { cul_scope_id: 0 };

              let name = path.parent.id?.name;

              var def_ = introspectionA.cul_functions.get(
                `${introspectionA.params.cul_scope_id}_${name}_`
              );

              if (def_ && def_.reason == "definition (renamed)") {
                name += "_";
                path.parent.id.name += "_";
              }

              if (path.node.params.length != 0) return; // memoization case export const y = (a) => {   dont replace a with {}

              console.log("g", `${introspectionA.params.cul_scope_id}_${name}`);
              const ins = [
                ...introspectionA.cul_input_map[
                  `${introspectionA.params.cul_scope_id}_${name}`
                ]
              ];

              path.node.params = [
                t.objectPattern(
                  ins.map((d) =>
                    t.objectProperty(
                      t.identifier(d),
                      t.identifier(d),
                      false,
                      true
                    )
                  )
                )
              ];
            },

            // convention to define e.g. an input called time is `export const time = () => time_in`
            // time_in is an identifier and input logic is below:
            Identifier(path, state) {
              // use original parentfn to match only, so inputs coded always coded as X = () => (X_in) even if X renamed to X_ due to override
              // I think this is sensible; you wouldn't hook such a formula into model unless you wanted the input (if not hooked up no impact as input will flow to no nodes)
              if (path.node.name == `${parentfnOrig}_in`) {
                // create input definition
                introspectionA.cul_functions.set(
                  `${introspectionA.cul_scope_id}_${path.node.name}`, // TODO: can remove scope concept for input definitions? May have dupes, but dupes not feeding into 1 model (I think)
                  {
                    cul_scope_id: introspectionA.cul_scope_id,
                    name: path.node.name, // units_in
                    cul_source_scope_id: introspectionA.cul_scope_id,
                    reason: "input definition"
                  }
                );
                // and create link
                var link = {
                  to: `${introspectionA.cul_scope_id}_${parentfn}`,
                  from: `${introspectionA.cul_scope_id}_${path.node.name}`,
                  reason: "input"
                };
                // don't include dupes of inputs, just for more readable graphs (e.g. goalseek case)
                // doesn't work, see https://stackoverflow.com/questions/29759480/how-to-customize-object-equality-for-javascript-set
                //if (!introspection.cul_links.has(link)) introspection.cul_links.add(link);
                // inefficient but quick alt.
                if (
                  [...introspectionA.cul_links]
                    .map((d) => JSON.stringify(d))
                    .indexOf(JSON.stringify(link)) == -1
                )
                  introspectionA.cul_links.add(link);
              }
            },
            CallExpression(path, state) {
              if (
                !introspectionA.cul_input_map[
                  // I really should use cul_functions and look for cul_scope_id?
                  `${introspectionA.params.cul_scope_id}_${path.node.callee.name}`
                ]
              )
                return; // ignore non-cul calls

              const ins = [
                ...introspectionA.cul_input_map[
                  `${introspectionA.params.cul_scope_id}_${path.node.callee.name}`
                ]
              ]; // a lot of assumptions here
              //if (path.node.arguments?[0] == undefined)

              const defined_args = (
                path.node.arguments[0] ? path.node.arguments[0].properties : []
              ).map((d) => d.key.name);
              path.node.arguments = [
                //...new Set([
                // fix bug here where t_in included twice (bounce)
                t.objectExpression([
                  ...ins
                    .map((d) =>
                      t.objectProperty(
                        t.identifier(d),
                        t.identifier(d),
                        false,
                        true
                      )
                    )
                    .filter((d) => !defined_args.includes(d.key.name)),
                  ...(path.node.arguments[0]
                    ? path.node.arguments[0].properties
                    : []) // todo check robustness of this merge with existing properties
                ])
                //]),
              ];
            }
          }
        })
      ]
    ]
  });
}