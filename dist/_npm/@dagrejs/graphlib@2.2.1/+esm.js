/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/@dagrejs/graphlib@2.2.1/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var e="\0",t="\0",r="";function s(e,t){e[t]?e[t]++:e[t]=1}function i(e,t){--e[t]||delete e[t]}function n(t,s,i,n){var o=""+s,a=""+i;if(!t&&o>a){var h=o;o=a,a=h}return o+r+a+r+(void 0===n?e:n)}function o(e,t){return n(e,t.v,t.w,t.name)}var a=class{#e=!0;#t=!1;#r=!1;#s;#i=()=>{};#n=()=>{};#o={};#a={};#h={};#d={};#u={};#c={};#f={};#l=0;#p=0;#v;#g;constructor(e){e&&(this.#e=!e.hasOwnProperty("directed")||e.directed,this.#t=!!e.hasOwnProperty("multigraph")&&e.multigraph,this.#r=!!e.hasOwnProperty("compound")&&e.compound),this.#r&&(this.#v={},this.#g={},this.#g[t]={})}isDirected(){return this.#e}isMultigraph(){return this.#t}isCompound(){return this.#r}setGraph(e){return this.#s=e,this}graph(){return this.#s}setDefaultNodeLabel(e){return this.#i=e,"function"!=typeof e&&(this.#i=()=>e),this}nodeCount(){return this.#l}nodes(){return Object.keys(this.#o)}sources(){var e=this;return this.nodes().filter((t=>0===Object.keys(e.#a[t]).length))}sinks(){var e=this;return this.nodes().filter((t=>0===Object.keys(e.#d[t]).length))}setNodes(e,t){var r=arguments,s=this;return e.forEach((function(e){r.length>1?s.setNode(e,t):s.setNode(e)})),this}setNode(e,r){return this.#o.hasOwnProperty(e)?(arguments.length>1&&(this.#o[e]=r),this):(this.#o[e]=arguments.length>1?r:this.#i(e),this.#r&&(this.#v[e]=t,this.#g[e]={},this.#g[t][e]=!0),this.#a[e]={},this.#h[e]={},this.#d[e]={},this.#u[e]={},++this.#l,this)}node(e){return this.#o[e]}hasNode(e){return this.#o.hasOwnProperty(e)}removeNode(e){var t=this;if(this.#o.hasOwnProperty(e)){var r=e=>t.removeEdge(t.#c[e]);delete this.#o[e],this.#r&&(this.#w(e),delete this.#v[e],this.children(e).forEach((function(e){t.setParent(e)})),delete this.#g[e]),Object.keys(this.#a[e]).forEach(r),delete this.#a[e],delete this.#h[e],Object.keys(this.#d[e]).forEach(r),delete this.#d[e],delete this.#u[e],--this.#l}return this}setParent(e,r){if(!this.#r)throw new Error("Cannot set parent in a non-compound graph");if(void 0===r)r=t;else{for(var s=r+="";void 0!==s;s=this.parent(s))if(s===e)throw new Error("Setting "+r+" as parent of "+e+" would create a cycle");this.setNode(r)}return this.setNode(e),this.#w(e),this.#v[e]=r,this.#g[r][e]=!0,this}#w(e){delete this.#g[this.#v[e]][e]}parent(e){if(this.#r){var r=this.#v[e];if(r!==t)return r}}children(e=t){if(this.#r){var r=this.#g[e];if(r)return Object.keys(r)}else{if(e===t)return this.nodes();if(this.hasNode(e))return[]}}predecessors(e){var t=this.#h[e];if(t)return Object.keys(t)}successors(e){var t=this.#u[e];if(t)return Object.keys(t)}neighbors(e){var t=this.predecessors(e);if(t){const s=new Set(t);for(var r of this.successors(e))s.add(r);return Array.from(s.values())}}isLeaf(e){return 0===(this.isDirected()?this.successors(e):this.neighbors(e)).length}filterNodes(e){var t=new this.constructor({directed:this.#e,multigraph:this.#t,compound:this.#r});t.setGraph(this.graph());var r=this;Object.entries(this.#o).forEach((function([r,s]){e(r)&&t.setNode(r,s)})),Object.values(this.#c).forEach((function(e){t.hasNode(e.v)&&t.hasNode(e.w)&&t.setEdge(e,r.edge(e))}));var s={};function i(e){var n=r.parent(e);return void 0===n||t.hasNode(n)?(s[e]=n,n):n in s?s[n]:i(n)}return this.#r&&t.nodes().forEach((e=>t.setParent(e,i(e)))),t}setDefaultEdgeLabel(e){return this.#n=e,"function"!=typeof e&&(this.#n=()=>e),this}edgeCount(){return this.#p}edges(){return Object.values(this.#c)}setPath(e,t){var r=this,s=arguments;return e.reduce((function(e,i){return s.length>1?r.setEdge(e,i,t):r.setEdge(e,i),i})),this}setEdge(){var e,t,r,i,o=!1,a=arguments[0];"object"==typeof a&&null!==a&&"v"in a?(e=a.v,t=a.w,r=a.name,2===arguments.length&&(i=arguments[1],o=!0)):(e=a,t=arguments[1],r=arguments[3],arguments.length>2&&(i=arguments[2],o=!0)),e=""+e,t=""+t,void 0!==r&&(r=""+r);var h=n(this.#e,e,t,r);if(this.#f.hasOwnProperty(h))return o&&(this.#f[h]=i),this;if(void 0!==r&&!this.#t)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(e),this.setNode(t),this.#f[h]=o?i:this.#n(e,t,r);var d=function(e,t,r,s){var i=""+t,n=""+r;if(!e&&i>n){var o=i;i=n,n=o}var a={v:i,w:n};s&&(a.name=s);return a}(this.#e,e,t,r);return e=d.v,t=d.w,Object.freeze(d),this.#c[h]=d,s(this.#h[t],e),s(this.#u[e],t),this.#a[t][h]=d,this.#d[e][h]=d,this.#p++,this}edge(e,t,r){var s=1===arguments.length?o(this.#e,arguments[0]):n(this.#e,e,t,r);return this.#f[s]}edgeAsObj(){const e=this.edge(...arguments);return"object"!=typeof e?{label:e}:e}hasEdge(e,t,r){var s=1===arguments.length?o(this.#e,arguments[0]):n(this.#e,e,t,r);return this.#f.hasOwnProperty(s)}removeEdge(e,t,r){var s=1===arguments.length?o(this.#e,arguments[0]):n(this.#e,e,t,r),a=this.#c[s];return a&&(e=a.v,t=a.w,delete this.#f[s],delete this.#c[s],i(this.#h[t],e),i(this.#u[e],t),delete this.#a[t][s],delete this.#d[e][s],this.#p--),this}inEdges(e,t){var r=this.#a[e];if(r){var s=Object.values(r);return t?s.filter((e=>e.v===t)):s}}outEdges(e,t){var r=this.#d[e];if(r){var s=Object.values(r);return t?s.filter((e=>e.w===t)):s}}nodeEdges(e,t){var r=this.inEdges(e,t);if(r)return r.concat(this.outEdges(e,t))}},h={Graph:a,version:"2.2.1"},d=a,u={write:function(e){var t={options:{directed:e.isDirected(),multigraph:e.isMultigraph(),compound:e.isCompound()},nodes:c(e),edges:f(e)};void 0!==e.graph()&&(t.value=structuredClone(e.graph()));return t},read:function(e){var t=new d(e.options).setGraph(e.value);return e.nodes.forEach((function(e){t.setNode(e.v,e.value),e.parent&&t.setParent(e.v,e.parent)})),e.edges.forEach((function(e){t.setEdge({v:e.v,w:e.w,name:e.name},e.value)})),t}};function c(e){return e.nodes().map((function(t){var r=e.node(t),s=e.parent(t),i={v:t};return void 0!==r&&(i.value=r),void 0!==s&&(i.parent=s),i}))}function f(e){return e.edges().map((function(t){var r=e.edge(t),s={v:t.v,w:t.w};return void 0!==t.name&&(s.name=t.name),void 0!==r&&(s.value=r),s}))}var l=function(e){var t,r={},s=[];function i(s){r.hasOwnProperty(s)||(r[s]=!0,t.push(s),e.successors(s).forEach(i),e.predecessors(s).forEach(i))}return e.nodes().forEach((function(e){t=[],i(e),t.length&&s.push(t)})),s};var p=class{#y=[];#E={};size(){return this.#y.length}keys(){return this.#y.map((function(e){return e.key}))}has(e){return this.#E.hasOwnProperty(e)}priority(e){var t=this.#E[e];if(void 0!==t)return this.#y[t].priority}min(){if(0===this.size())throw new Error("Queue underflow");return this.#y[0].key}add(e,t){var r=this.#E;if(e=String(e),!r.hasOwnProperty(e)){var s=this.#y,i=s.length;return r[e]=i,s.push({key:e,priority:t}),this.#m(i),!0}return!1}removeMin(){this.#b(0,this.#y.length-1);var e=this.#y.pop();return delete this.#E[e.key],this.#O(0),e.key}decrease(e,t){var r=this.#E[e];if(t>this.#y[r].priority)throw new Error("New priority is greater than current priority. Key: "+e+" Old: "+this.#y[r].priority+" New: "+t);this.#y[r].priority=t,this.#m(r)}#O(e){var t=this.#y,r=2*e,s=r+1,i=e;r<t.length&&(i=t[r].priority<t[i].priority?r:i,s<t.length&&(i=t[s].priority<t[i].priority?s:i),i!==e&&(this.#b(e,i),this.#O(i)))}#m(e){for(var t,r=this.#y,s=r[e].priority;0!==e&&!(r[t=e>>1].priority<s);)this.#b(e,t),e=t}#b(e,t){var r=this.#y,s=this.#E,i=r[e],n=r[t];r[e]=n,r[t]=i,s[n.key]=e,s[i.key]=t}},v=p,g=function(e,t,r,s){return function(e,t,r,s){var i,n,o={},a=new v,h=function(e){var t=e.v!==i?e.v:e.w,s=o[t],h=r(e),d=n.distance+h;if(h<0)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+e+" Weight: "+h);d<s.distance&&(s.distance=d,s.predecessor=i,a.decrease(t,d))};e.nodes().forEach((function(e){var r=e===t?0:Number.POSITIVE_INFINITY;o[e]={distance:r},a.add(e,r)}));for(;a.size()>0&&(i=a.removeMin(),(n=o[i]).distance!==Number.POSITIVE_INFINITY);)s(i).forEach(h);return o}(e,String(t),r||w,s||function(t){return e.outEdges(t)})},w=()=>1;var y=g,E=function(e,t,r){return e.nodes().reduce((function(s,i){return s[i]=y(e,i,t,r),s}),{})};var m=function(e){var t=0,r=[],s={},i=[];function n(o){var a=s[o]={onStack:!0,lowlink:t,index:t++};if(r.push(o),e.successors(o).forEach((function(e){s.hasOwnProperty(e)?s[e].onStack&&(a.lowlink=Math.min(a.lowlink,s[e].index)):(n(e),a.lowlink=Math.min(a.lowlink,s[e].lowlink))})),a.lowlink===a.index){var h,d=[];do{h=r.pop(),s[h].onStack=!1,d.push(h)}while(o!==h);i.push(d)}}return e.nodes().forEach((function(e){s.hasOwnProperty(e)||n(e)})),i};var b=m,O=function(e){return b(e).filter((function(t){return t.length>1||1===t.length&&e.hasEdge(t[0],t[0])}))};var k=function(e,t,r){return function(e,t,r){var s={},i=e.nodes();return i.forEach((function(e){s[e]={},s[e][e]={distance:0},i.forEach((function(t){e!==t&&(s[e][t]={distance:Number.POSITIVE_INFINITY})})),r(e).forEach((function(r){var i=r.v===e?r.w:r.v,n=t(r);s[e][i]={distance:n,predecessor:e}}))})),i.forEach((function(e){var t=s[e];i.forEach((function(r){var n=s[r];i.forEach((function(r){var s=n[e],i=t[r],o=n[r],a=s.distance+i.distance;a<o.distance&&(o.distance=a,o.predecessor=i.predecessor)}))}))})),s}(e,t||N,r||function(t){return e.outEdges(t)})},N=()=>1;function C(e){var t={},r={},s=[];if(e.sinks().forEach((function i(n){if(r.hasOwnProperty(n))throw new j;t.hasOwnProperty(n)||(r[n]=!0,t[n]=!0,e.predecessors(n).forEach(i),delete r[n],s.push(n))})),Object.keys(t).length!==e.nodeCount())throw new j;return s}class j extends Error{constructor(){super(...arguments)}}var P=C;C.CycleException=j;var I=P;var L=function(e,t,r){Array.isArray(t)||(t=[t]);var s=e.isDirected()?t=>e.successors(t):t=>e.neighbors(t),i="post"===r?D:F,n=[],o={};return t.forEach((t=>{if(!e.hasNode(t))throw new Error("Graph does not have node: "+t);i(t,s,o,n)})),n};function D(e,t,r,s){for(var i=[[e,!1]];i.length>0;){var n=i.pop();n[1]?s.push(n[0]):r.hasOwnProperty(n[0])||(r[n[0]]=!0,i.push([n[0],!0]),M(t(n[0]),(e=>i.push([e,!1]))))}}function F(e,t,r,s){for(var i=[e];i.length>0;){var n=i.pop();r.hasOwnProperty(n)||(r[n]=!0,s.push(n),M(t(n),(e=>i.push(e))))}}function M(e,t){for(var r=e.length;r--;)t(e[r],r,e);return e}var S=L;var G=L;var T=a,x=p;var A={Graph:h.Graph,json:u,alg:{components:l,dijkstra:g,dijkstraAll:E,findCycles:O,floydWarshall:k,isAcyclic:function(e){try{I(e)}catch(e){if(e instanceof I.CycleException)return!1;throw e}return!0},postorder:function(e,t){return S(e,t,"post")},preorder:function(e,t){return G(e,t,"pre")},prim:function(e,t){var r,s=new T,i={},n=new x;function o(e){var s=e.v===r?e.w:e.v,o=n.priority(s);if(void 0!==o){var a=t(e);a<o&&(i[s]=r,n.decrease(s,a))}}if(0===e.nodeCount())return s;e.nodes().forEach((function(e){n.add(e,Number.POSITIVE_INFINITY),s.setNode(e)})),n.decrease(e.nodes()[0],0);var a=!1;for(;n.size()>0;){if(r=n.removeMin(),i.hasOwnProperty(r))s.setEdge(r,i[r]);else{if(a)throw new Error("Input graph is not connected: "+e);a=!0}e.nodeEdges(r).forEach(o)}return s},tarjan:m,topsort:P},version:h.version},z=A.Graph,V=A.alg,Y=A.json,_=A.version;export{z as Graph,V as alg,A as default,Y as json,_ as version};