// https://codemirror.net/examples/bundle/

// guided by node_modules/codemirror/dist/index.js

import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, highlightTrailingWhitespace, drawSelection, dropCursor, /*rectangularSelection, crosshairCursor,*/ highlightActiveLine, keymap, scrollPastEnd } from '@codemirror/view';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap, syntaxTree, foldAll } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';

import { introspection2 } from "../components/mini-calculang-rollup.js"

//import { EditorView, basicSetup } from "codemirror"
import { javascript, javascriptLanguage, esLint } from "@codemirror/lang-javascript"


/////// linting ///

// linting via eslint might be mad heavy??? a few calculang-specific things instead?
// example  https://github.com/UziTech/eslint-linter-browserify/blob/f0d475beb86e50df09e2db76e2770608c6e74f47/example/script.js
import { linter, lintGutter } from "@codemirror/lint";
import * as eslint from "eslint-linter-browserify";

export const config = {
  // eslint configuration
  parserOptions: {
    ecmaVersion: 2019, // ?
    sourceType: "module",
  },
  env: { // ?
    browser: true,
    node: true,
  },
  rules: {
    //semi: ["warn", "never"],
    "no-undef": ["error", "never"], // this is a key rule for calculang, but is easier to use on JS (because of intentional undefined inputs in _in convention)
    "func-style": ["error", "expression"],
    "consistent-return": ["error"], // not as good as forcing a return ..
    // no-unused-expressions works in some cases but not others?
    // bug whenever a = () => {b()}, but b()*3 works
    "no-unused-expressions": ["error"], // doesn't catch when there are calls because doesn't know about purity ..
    "prefer-const": "warn",
    'no-restricted-syntax': [ // docs https://eslint.org/docs/latest/rules/no-restricted-syntax
      'error',
      {
        message: "calculang: don't pollute the _ namespace",
        selector:
          'ImportDeclaration[source.value=/cul_scope_/] > ImportSpecifier[local.name=/_$/]',
        // converted to esm => match cul_scope_x rather than .cul
      }, // test with import {create as confetti_} from "https://cdn.jsdelivr.net/npm/canvas-confetti/+esm?cul_scope_id=3";

    ],

  },
  // "extends": "eslint:recommended" not working; not sure I want
};





// some custom stuff
import snippetbuilder from 'codemirror-6-snippetbuilder'

import jssnippetarray from './snippetarray.js'

import interact from '@replit/codemirror-interact';

// WISHLIST:
// debounce compilation !! CM has linter logic to execute linting on pause?
// clearup autocomplete
// REFACTORING: selection to formula (+replace other occurances)
// " selection wraped in dupe true conditional and calculang-patterns of this
// done highlight initially or in readonly mode?
// coloured brackets or something like it
// prettier/eslint integration (moreso eslint!)
// ~~tab behaviour~~ a11y https://codemirror.net/examples/tab/
// rename or select all on highlight a fn name


// calculang specific stuff
// on autocompletion to calculang f do () and {}?
// NAVIGATION WITH PROPER SCROLLTO/INTOVIEW
// use tooltips vs decorations & css positioning for overlays (which works)? https://codemirror.net/examples/tooltip/
// better decoration to deemphasize cruft

// going wild for a little with extensions
import { indentationMarkers } from '@replit/codemirror-indentation-markers'; // calculang is expression-heavy so I think this isn't useful

const readonly = false;
const decorations = true;

let introspection; // it is crazy to run introspection here on each edit - but I can mitigate, and the real crazy thing is actually running the model (on WIP stuff which will fail)

// from calculang-at-fosdem
///////////////////////////
let calculang_identifier_decorations = () => {
  return ViewPlugin.fromClass(class {
    constructor(view) {
      introspection = introspection2(view.state.doc.toString())
      this.decorations = identifier_decorations(view);
    }

    update(u) {
      let introspection_new
      try { // without a try inevitable errors break plugin (though should be off when not readonly !)
        // TODO wrap in readonly
        introspection_new = introspection2(u.state.doc.toString())
        //console.log('TTT', introspection2(u.state.doc.toString()))
      } catch (e) { introspection_new = introspection }
      introspection = introspection_new
      if (u.docChanged || u.viewportChanged) // I need to capture fold changes too !
        this.decorations = identifier_decorations(u.view);
      /*if (1 || update.docChanged) {
        this.decorations = identifier_decorations(view);
        this.dom.textContent = update.state.doc.length
      }*/
    }

    destroy() { this.dom.remove() }
  },
    {
      decorations: (v) => v.decorations
    }
  )
}

let formulae_all

// Decoration.marks specified by ranges
const identifier_decorations = view => {
  let decorations = [];
  //introspection = introspection2(view.state.doc.toString())
  const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition').map(d => d.name).sort()
  try {
    formulae_all = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name/*+'_in'*/) == -1).map(d => d.name)//["line", "result", "wave","semi_circle", "x", "n", "radius"]
  } catch (e) { }

  //for (let { from, to } of view.visibleRanges) {
  console.log(view.state)
  console.log(view.visibleRanges)
  //for (let { from, to } of [{from: 0, to: 1000}]) {
  //debugger;
  //debugger;
  for (let { from, to } of view.visibleRanges) {
    //for (let { from, to } of [{from:0, to:5000}]) {
    //cmImports.language.syntaxTreeAvailable(view.state, )
    //cmImports.language.forceParsing(view, )

    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name == "VariableDefinition") {
          let name = view.state.doc.sliceString(node.from, node.to);
          if (formulae_all.includes(name)) {
            decorations.push(
              Decoration.mark({ class: "calculang_title" }).range(
                node.from,
                node.to
              )
            );
          }
          if (formulae_all.includes(name + '_')) {
            decorations.push(
              Decoration.mark({ class: "calculang_title calculang_title_renamed" }).range(
                node.from,
                node.to
              )
            );
          }
        }

        if (node.name == "VariableName") {
          let name = view.state.doc.sliceString(node.from, node.to);
          if (formulae_all.includes(name)) {
            if (inputs.includes(name + "_in"))
              decorations.push(
                Decoration.mark({ class: `calculang_call calculang_call_input calculang_call_${name}` }).range(
                  node.from,
                  node.to
                )
              );
            else
              decorations.push(
                Decoration.mark({ class: `calculang_call calculang_call_${name}` }).range(node.from, node.to)
              );
          }
        }
      }
    });
  }
  return Decoration.set(decorations);
}
///////////////////////////

let i = 0;

let editor = ({ doc, update, updateSelection }) => {
  return new EditorView({
    doc,
    extensions: [
      EditorView.updateListener.of(u => { if (!i++) foldAll(u.view); console.log('hihi', u.docChanged); let new_s = u.state.doc.toString(); if (u.docChanged) { /*update(u)*/; console.log('DN update listener plugin NOT !!! called an update') }; }),
      javascript(),

      EditorState.readOnly.of(readonly),
      //EditorView.editable.of(!readonly), // leaving editable so that code can be searched; but removes cursor which is nice

      // basicSetup

      lineNumbers(),   // make optional? Actually keeping due to space used by Framework gutter selection - review this? mini mode no gutter/line nums? or for Mobile?
      //highlightActiveLineGutter(),
      highlightSpecialChars(), // I can put custom stuff here
      highlightTrailingWhitespace(), // me. trailing whitespace is buggy e.g. after if (Math.abs(x()) > radius()) return 0;
      history(),
      foldGutter(),
      lintGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true), // float this
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      //rectangularSelection(),
      //crosshairCursor(),
      readonly ? EditorState.readOnly.of(readonly) : highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap, // ctrl + i select parent syntax
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap, // ctrl+ alt + [ or ] fold/unfold all
        ...completionKeymap, // ctrl+space
        ...lintKeymap // ctrl+shift+m
      ]),

      // a maybe one
      //scrollPastEnd(),

      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          height: "60vh",
          background: "white",
          marginTop: "10px",
          fontSize: "1rem",
        },
        ".cm-scroller": { overflow: "auto" }
      }),

      indentationMarkers({
        colors: {
          light: 'LightBlue',
          dark: 'DarkBlue',
          activeLight: 'LightGreen',
          activeDark: 'DarkGreen',
        }
      }),


      // TODO add cul snippets! & capture tabs proper
      javascriptLanguage.data.of({
        autocomplete: snippetbuilder({
          source: jssnippetarray
        })
      }),

      // BUG this runs even whenever readonly !
      interact({
        rules: [
          // bool toggler
          {
            regexp: /true|false/g,
            cursor: 'pointer',
            onClick: (text, setText) => {
              switch (text) {
                case 'true': return setText('false');
                case 'false': return setText('true');
              }
            },
          },

          // a rule for a number dragger
          {
            // the regexp matching the value
            regexp: /-?\b\d+\.?\d*\b/g,
            // set cursor to "ew-resize" on hover
            cursor: "ew-resize",
            // change number value based on mouse X movement on drag
            onDrag: (text, setText, e) => {
              const newVal = Number(text) + e.movementX;
              if (isNaN(newVal)) return;
              setText(newVal.toString());
            },
          }
        ],
      }),

      !decorations ? EditorState.readOnly.of(readonly) : calculang_identifier_decorations(),

      // from https://codemirror.net/docs/guide/
      ViewPlugin.fromClass(class {
        constructor(view) {
          this.dom = view.dom.appendChild(document.createElement("div"))
          this.dom.style.cssText =
            "position: absolute; inset-block-start: 2px; inset-inline-end: 5px; font-size: 0.2em"
          this.dom.textContent = view.state.doc.length
        }

        update(update) {
          if (update.docChanged)
            this.dom.textContent = update.state.doc.length
        }

        destroy() { this.dom.remove() }
      }),

      // Toph Tuckers eval-in-place implementation
      // https://observablehq.com/@tophtucker/eval-in-place
      keymap.of([
        {
          key: "F9",
          run: expand
        }
      ]),
      keymap.of([
        {
          key: "F8",
          run: expand_calculang(updateSelection)
        }
      ]),

      linter(
        view => {
          let o = esLint(new eslint.Linter(), config)(view).filter(d => !(d.source == 'eslint:no-undef' && d.message.includes("_in'")));
          if (o.length == 0)
            update(view); // also update on drag events for inspect plugin?
          return o;
        }),

    ],
    parent: document.body
  })
}

// Toph Tuckers eval-in-place implementation
// https://observablehq.com/@tophtucker/eval-in-place

const expand = function (view) {
  console.log("expand", view)
  view.dispatch(
    view.state.changeByRange((range) => {
      const result = evaluate(view.state.sliceDoc(range.from, range.to));

      // Evaluation errored, don’t do anything
      if (result === false) return { range };

      // How much longer is the new string?
      const rangeLengthDif = result.length - (range.to - range.from);

      return {
        changes: {
          from: range.from,
          to: range.to,
          insert: result
        },
        // The updated selection range
        range: EditorSelection.range(
          range.from,
          range.to + rangeLengthDif
        )
      };
    })
  );

  return true;
}

// based on expand above
const expand_calculang = updateSelection => function (view) {
  debugger;
  console.log("expand calculang", view)
  view.dispatch(
    view.state.changeByRange((range) => {
      const result = evaluate(view.state.sliceDoc(range.from, range.to));

      updateSelection({/*range.from*/from: {line:view.state.doc.lineAt(view.state.selection.main.from).number,
        column:view.state.selection.ranges[0].from - view.state.doc.lineAt(view.state.selection.main.from).from}, 
        to:{line:view.state.doc.lineAt(view.state.selection.main.to).number,
          column:view.state.selection.ranges[0].to - view.state.doc.lineAt(view.state.selection.main.to).from}})
      //updateSelection(view.state.sliceDoc(range.from, range.to))

      // Evaluation errored, don’t do anything
      if (result === false || 1) return { range };

      // How much longer is the new string?
      const rangeLengthDif = result.length - (range.to - range.from);

      return {
        changes: {
          from: range.from,
          to: range.to,
          insert: result
        },
        // The updated selection range
        range: EditorSelection.range(
          range.from,
          range.to + rangeLengthDif
        )
      };
    })
  );

  return true;
}

// Currently just manually passes in d3 and lodash (_) as fun things to use.
// I’d love to figure out how to pass in everything in scope at the cursor!!
const evaluate = (expr) => {
  try {
    const result = new Function(...Object.keys(libs), `return ${expr}`)(
      ...Object.values(libs)
    );
    return typeof result === "object" ? JSON.stringify(result) : String(result);
  } catch {
    return false;
  }
}

// Add anything you want F9 to be able to reference during evaluation;
// these are passed to the new Function constructed above.
// DN todo: add calculang model somehow => F9 breaks from inputs (but still terse)
const libs = ({
  //d3,
  //_
})


export { editor }

//export { EditorView, basicSetup, javascript }