'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Decco = require("decco/src/Decco.js");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Js_json = require("bs-platform/lib/js/js_json.js");
var Relude_IO = require("relude/src/Relude_IO.bs.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var ReludeFetch = require("relude-fetch/src/ReludeFetch.bs.js");
var Relude_Result = require("relude/src/Relude_Result.bs.js");
var ReludeFetch_Error = require("relude-fetch/src/ReludeFetch_Error.bs.js");
var ReludeFetch_Response = require("relude-fetch/src/ReludeFetch_Response.bs.js");

function show(error) {
  return ReludeFetch_Error.show((function (a) {
                return a;
              }), error);
}

var Type = { };

var $$Error = {
  show: show,
  Type: Type
};

var IOE = Relude_IO.WithError(Type);

function t_encode(v) {
  return Js_dict.fromArray([
              /* tuple */[
                "userId",
                Decco.intToJson(v.userId)
              ],
              /* tuple */[
                "title",
                Decco.stringToJson(v.title)
              ],
              /* tuple */[
                "body",
                Decco.stringToJson(v.body)
              ]
            ]);
}

function t_decode(v) {
  var match = Js_json.classify(v);
  if (typeof match === "number" || match.tag !== /* JSONObject */2) {
    return Decco.error(undefined, "Not an object", v);
  } else {
    var dict = match[0];
    var match$1 = Decco.intFromJson(Belt_Option.getWithDefault(Js_dict.get(dict, "userId"), null));
    if (match$1.tag) {
      var e = match$1[0];
      return /* Error */Block.__(1, [{
                  path: ".userId" + e.path,
                  message: e.message,
                  value: e.value
                }]);
    } else {
      var match$2 = Decco.stringFromJson(Belt_Option.getWithDefault(Js_dict.get(dict, "title"), null));
      if (match$2.tag) {
        var e$1 = match$2[0];
        return /* Error */Block.__(1, [{
                    path: ".title" + e$1.path,
                    message: e$1.message,
                    value: e$1.value
                  }]);
      } else {
        var match$3 = Decco.stringFromJson(Belt_Option.getWithDefault(Js_dict.get(dict, "body"), null));
        if (match$3.tag) {
          var e$2 = match$3[0];
          return /* Error */Block.__(1, [{
                      path: ".body" + e$2.path,
                      message: e$2.message,
                      value: e$2.value
                    }]);
        } else {
          return /* Ok */Block.__(0, [{
                      userId: match$1[0],
                      title: match$2[0],
                      body: match$3[0]
                    }]);
        }
      }
    }
  }
}

function response_encode(v) {
  return Js_dict.fromArray([/* tuple */[
                "id",
                Decco.intToJson(v.id)
              ]]);
}

function response_decode(v) {
  var match = Js_json.classify(v);
  if (typeof match === "number" || match.tag !== /* JSONObject */2) {
    return Decco.error(undefined, "Not an object", v);
  } else {
    var match$1 = Decco.intFromJson(Belt_Option.getWithDefault(Js_dict.get(match[0], "id"), null));
    if (match$1.tag) {
      var e = match$1[0];
      return /* Error */Block.__(1, [{
                  path: ".id" + e.path,
                  message: e.message,
                  value: e.value
                }]);
    } else {
      return /* Ok */Block.__(0, [{
                  id: match$1[0]
                }]);
    }
  }
}

var url = "https://jsonplaceholder.typicode.com/posts";

function make(userId, title, body) {
  return {
          userId: userId,
          title: title,
          body: body
        };
}

function decode(json) {
  return Curry._2(Relude_Result.mapError, (function (param) {
                return "Decode failed";
              }), response_decode(json));
}

function create(formData) {
  return Curry._2(IOE.Infix.$great$great$eq, ReludeFetch.fetchWith(/* Post */2, undefined, /* Json */Block.__(1, [t_encode(formData)]), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, url), (function (param) {
                return ReludeFetch_Response.Json.decode(decode, param);
              }));
}

var Posts = {
  t_encode: t_encode,
  t_decode: t_decode,
  response_encode: response_encode,
  response_decode: response_decode,
  url: url,
  make: make,
  decode: decode,
  create: create
};

exports.$$Error = $$Error;
exports.IOE = IOE;
exports.Posts = Posts;
/* IOE Not a pure module */
