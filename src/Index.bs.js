'use strict';

var React = require("react");
var ReactDom = require("react-dom");
var App$ReformReproduce = require("./App.bs.js");
var ExampleStyles$ReformReproduce = require("./ExampleStyles.bs.js");

var style = document.createElement("style");

document.head.appendChild(style);

style.innerHTML = ExampleStyles$ReformReproduce.style;

function makeContainer(text) {
  var container = document.createElement("div");
  container.className = "container";
  var title = document.createElement("div");
  title.className = "containerTitle";
  title.innerText = text;
  var content = document.createElement("div");
  content.className = "containerContent";
  container.appendChild(title);
  container.appendChild(content);
  document.body.appendChild(container);
  return content;
}

ReactDom.render(React.createElement(App$ReformReproduce.make, { }), makeContainer("Reason Using JS Using Reason"));

exports.style = style;
exports.makeContainer = makeContainer;
/* style Not a pure module */
