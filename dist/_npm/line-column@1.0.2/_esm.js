/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/line-column@1.0.2/lib/line-column.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import n from"../isarray@1.0.0/_esm.js";import i from"../isobject@2.1.0/_esm.js";
/**
 * line-column - Convert efficiently index to/from line-column in a string
 * @module  lineColumn
 * @license MIT
 */var t=n,e=i,r=o;function o(n,i){if(!(this instanceof o))return"number"==typeof i?new o(n).fromIndex(i):new o(n,i);this.str=n||"",this.lineToIndex=function(n){for(var i=n.split("\n"),t=new Array(i.length),e=0,r=0,o=i.length;r<o;r++)t[r]=e,e+=i[r].length+1;return t}(this.str),i=i||{},this.origin=void 0===i.origin?1:i.origin}o.prototype.fromIndex=function(n){if(n<0||n>=this.str.length||isNaN(n))return null;var i=function(n,i){if(n>=i[i.length-1])return i.length-1;var t,e=0,r=i.length-2;for(;e<r;)if(n<i[t=e+(r-e>>1)])r=t-1;else{if(!(n>=i[t+1])){e=t;break}e=t+1}return e}(n,this.lineToIndex);return{line:i+this.origin,col:n-this.lineToIndex[i]+this.origin}},o.prototype.toIndex=function(n,i){if(void 0===i)return t(n)&&n.length>=2?this.toIndex(n[0],n[1]):e(n)&&"line"in n&&("col"in n||"column"in n)?this.toIndex(n.line,"col"in n?n.col:n.column):-1;if(isNaN(n)||isNaN(i))return-1;if(n-=this.origin,i-=this.origin,n>=0&&i>=0&&n<this.lineToIndex.length){var r=this.lineToIndex[n];if(i<(n===this.lineToIndex.length-1?this.str.length:this.lineToIndex[n+1])-r)return r+i}return-1};export{r as default};
