(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "petals", function() { return petals; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "head", function() { return head; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "circle", function() { return circle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "face_eyes", function() { return face_eyes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "face_mouth", function() { return face_mouth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "face", function() { return face; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "result", function() { return result; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "row", function() { return row; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "column", function() { return column; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "petal_size", function() { return petal_size; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "petal_num", function() { return petal_num; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "petals_roundy_spikiness", function() { return petals_roundy_spikiness; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x0", function() { return x0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y0", function() { return y0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return r; });
// based on awesome "Painting with Maths in Google Sheets" by Inigo Quilez (https://iquilezles.org/)
// https://www.youtube.com/watch?v=JnCkF62gkOY
// his Google doc visual:
// https://docs.google.com/spreadsheets/d/1zPtl4DpFRb-RANetrK4RrgSH-nuttDo6FdSgNiViKic/edit#gid=794943047

// I migrated his formula(!) with very minor changes into result formula below
// and then I split it into different meaningful bits
// (petals, head, face) so I can visualize them seperately as I want.
// I made some petal features customizable by inputs.
// I also changed the eyes to be a composition of every high-schoolers equation of a circle (not smooth like everything else, but ok)

const petals = ({ petal_size_in, petal_num_in, column_in, row_in, petals_roundy_spikiness_in }) =>
min(
  1,
  max(
    0,
    20 +
    petal_size({ petal_size_in }) *
    (0.5 +
    0.5 * cos(petal_num({ petal_num_in }) * atan2(column({ column_in }) - 50.5, row({ row_in }) - 50.5))) **
    petals_roundy_spikiness({ petals_roundy_spikiness_in }) -
    sqrt((column({ column_in }) - 50.5) ** 2 + (row({ row_in }) - 50.5) ** 2)
  )
);
const head = ({ column_in, row_in }) =>
min(1, max(0, 19 - sqrt((column({ column_in }) - 50.5) ** 2 + (row({ row_in }) - 50.5) ** 2)));

const circle = ({ column_in, x0_in, row_in, y0_in, r_in }) => // used with inputs r_in, x0_in, y0_in below
(column({ column_in }) - x0({ x0_in })) ** 2 + (row({ row_in }) - y0({ y0_in })) ** 2 < r({ r_in }) ** 2;

// I refactored eyes to use a circle function
// I lost some smoothness but I gained some freaky eyes
const face_eyes = ({ column_in, row_in }) =>
2 * (
circle({ column_in, row_in, r_in: 4, x0_in: 45, y0_in: 45 }) -
circle({ column_in, row_in, r_in: 2, x0_in: 45, y0_in: 45 + 1 }) +
circle({ column_in, row_in, r_in: 4, x0_in: 55, y0_in: 45 }) -
circle({ column_in, row_in, r_in: 2, x0_in: 55, y0_in: 45 + 1 }));

const face_mouth = ({ row_in, column_in }) =>
2 *
min(1, max(0, row({ row_in }) - 50.5)) *
min(
  1,
  max(0, 2 - abs(8 - sqrt((column({ column_in }) - 50.5) ** 2 + (row({ row_in }) - 50.5) ** 2)))
);

const face = ({ column_in, row_in }) => face_eyes({ column_in, row_in }) + face_mouth({ row_in, column_in });

const result = ({ petal_size_in, petal_num_in, column_in, row_in, petals_roundy_spikiness_in }) => petals({ petal_size_in, petal_num_in, column_in, row_in, petals_roundy_spikiness_in }) + head({ column_in, row_in }) + face({ column_in, row_in });

// just convenience stuff:
let cos = Math.cos;
let sqrt = Math.sqrt;
let abs = Math.abs;
let atan2 = Math.atan2;
let min = Math.min;
let max = Math.max;

// inputs:
const row = ({ row_in }) => row_in;
const column = ({ column_in }) => column_in;

const petal_size = ({ petal_size_in }) => petal_size_in;
const petal_num = ({ petal_num_in }) => petal_num_in;
const petals_roundy_spikiness = ({ petals_roundy_spikiness_in }) => petals_roundy_spikiness_in;

// for circle
const x0 = ({ x0_in }) => x0_in;
const y0 = ({ y0_in }) => y0_in;
const r = ({ r_in }) => r_in;

/***/ })
/******/ ]);
});
//# sourceMappingURL=flower.js.map