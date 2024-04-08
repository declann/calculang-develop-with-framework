// by Roeland Schoukens
// modified by me (not working)
//https://observablehq.com/@roelandschoukens/inputs

import {html} from "npm:htl";
import {require} from "npm:d3-require";
//import {DOM} from 'npm:@observablehq/stdlib' 

// https://github.com/observablehq/stdlib/blob/main/src/dom/context2d.js
function context2d(width, height, dpi) {
  if (dpi == null) dpi = devicePixelRatio;
  var canvas = document.createElement("canvas");
  canvas.width = width * dpi;
  canvas.height = height * dpi;
  canvas.style.width = width + "px";
  var context = canvas.getContext("2d");
  context.scale(dpi, dpi);
  return context;
}



const topojson = await require("topojson-client@3")

const d3 = await require('d3')
const graticule = d3.geoGraticule10()
// https://github.com/topojson/world-atlas
const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
const countries = []//topojson.feature(world, world.objects.countries)

const label_size = '80%'
const label_style = `font: 13px/1.2 var(--sans-serif); width: 120px; font-size: ${label_size};`

  const defaultTheme =
    {landColor: "#596", seaColor: "#def", borderColor: "#fff",
     outlineColor: "#888", gridColor: "#444",
     markColors: ["white", "black"]};

  const themes = 
  {"color": defaultTheme,
    "bw":
    {landColor: "#666", seaColor: "#eee", borderColor: "#fff",
     outlineColor: "#888", gridColor: "#444",
     markColors: ["white", "black"]},
    "bw-light":
    {landColor: "#bbb", seaColor: "#fff", borderColor: "#666",
     outlineColor: "#888", gridColor: "#444",
     markColors: ["white", "black"]}
  };

  function _mapInput(settings = {})
  {
    const { width=360, label,
           theme = defaultTheme,
            valueLabel=true,
            projectionFactory = d3.geoNaturalEarth1} = settings;
    var { value=[0, 0] } = settings;
    
    const ourTheme = themes[theme] || {...defaultTheme, ...theme}

    // calculate height
    const proj0 = projectionFactory();
    const proj1 = proj0.fitWidth(width, {type: "Sphere"});
    const height = Math.ceil(d3.geoPath(proj1).bounds({type: "Sphere"})[1][1]);

    // margin so we can draw our marker outside the bounding box.
    // offsetting an extra 0.5 pixels will line up the grid and
    // border with the logical pixels for equirectangular projection
    const cmargin = 6.5;
    const cwidth = width + 2*cmargin;
    const cheight = height + 2*cmargin;
    const context = context2d(cwidth, cheight);
    context.lineJoin = "round";
    const projection = proj0.fitExtent([[cmargin, cmargin], [cwidth-cmargin, cheight-cmargin]], {type: "Sphere"});
    const path = d3.geoPath(projection, context);
    var mousedown = false;
    var pageX0, pageY0;
  
    // ocean and land color
    context.beginPath(); path({type: "Sphere"});
    context.fillStyle = ourTheme.seaColor; context.fill();
    context.beginPath();// path(countries);
    context.fillStyle = ourTheme.landColor; context.fill();
  
    // grid
    context.beginPath(); path(graticule);
    context.lineWidth = .15; context.strokeStyle = ourTheme.gridColor; context.stroke();
  
    // borders
    context.beginPath(); //path(countries);
    context.strokeStyle = ourTheme.borderColor; context.stroke();
  
    // map outline
    context.beginPath(); path({type: "Sphere"});
    context.lineWidth = 1; context.strokeStyle = ourTheme.outlineColor; context.stroke();
    
    const image = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  
    // DOM:
    var div = html`<div style="display: flex; flex-wrap: wrap;
    max-width: 100%; align-items: center; font-family: var(--sans-serif);">`
    if (label) {
      var lb = div.appendChild(html`<label>`)
      lb.innerText = label;
      lb.style = label_style;
    }
    var div2 = div.appendChild(html`<div>`);
    div2.appendChild(context.canvas);
    context.canvas.style.maxWidth = '100%';
    if (valueLabel) {
      var p = div2.appendChild(html`<p style='text-align: center; margin: .2em 0 0 0; font-size: ${label_size};'>`);
    }
    
    function setValue(coordinates) {
      value = coordinates;
      // render canvas
      context.clearRect(0, 0, cwidth, cheight);
      context.putImageData(image, 0, 0);
      context.lineWidth = 2.4;
      path.pointRadius(5.3); context.strokeStyle = ourTheme.markColors[0];
      context.beginPath(); path({type: "Point", coordinates}); context.stroke();
      context.lineWidth = 1.4;
      path.pointRadius(4.4); context.strokeStyle = ourTheme.markColors[1];
      context.beginPath(); path({type: "Point", coordinates}); context.stroke();
      // value label
      if (p) {
        var letter0 = coordinates[0] < 0 ? "W" : "E";
        var letter1 = coordinates[1] < 0 ? "S" : "N";
        p.innerText = `${Math.abs(coordinates[0]).toFixed(1)}°\xa0${letter0}, ${Math.abs(coordinates[1]).toFixed(1)}°\xa0${letter1}`;
      }
    }

    function clamp(a, b, x)
    {
      return Math.max(a, Math.min(b, x));
    }
  
    function drag(event)
    {
      if (!mousedown) return;
      const {pageX , pageY} = event;
      // get coordinate of the centre of this pixel:
      var scale = cwidth / context.canvas.offsetWidth;
      var layerX = (pageX  - pageX0) * scale + .5;
      var layerY = (pageY - pageY0) * scale + .5;
      layerX = clamp(cmargin, cwidth-cmargin, layerX);
      layerY = clamp(cmargin, cheight-cmargin, layerY);
      div.value = projection.invert([layerX, layerY]);
      div.dispatchEvent(new CustomEvent("input"));
    };

    // mousedown listener (on canvas)
    context.canvas.onmousedown = function(event) {
      if (event.buttons != 1) return;
      mousedown = true;
      pageX0 = (event.pageX  - event.offsetX)
      pageY0 = (event.pageY - event.offsetY)
      drag(event);
    };
    
    // attach the other event listeners to document, otherwise the drag operation
    // gets stuck if the mouse leaves the canvas
    document.addEventListener("mousemove", drag)
    document.addEventListener("mouseup", event => { mousedown = false; });

    Object.defineProperty(div, "value", {
    get() {
      return value;
    },
    set(v) {
      setValue(v);
    }});
      
    div.value = value;
    return div;
  }

  _mapInput.defaultTheme = defaultTheme;
  _mapInput.themes = themes;
  
  export const location = _mapInput;