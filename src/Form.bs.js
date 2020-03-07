'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Relude_IO = require("relude/src/Relude_IO.bs.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var ReForm$BsReform = require("bs-reform/src/ReForm.bs.js");
var Helpers$BsReform = require("bs-reform/src/Helpers.bs.js");
var ReludeReact_Render = require("relude-reason-react/src/ReludeReact_Render.bs.js");
var Relude_AsyncResult = require("relude/src/Relude_AsyncResult.bs.js");
var API$ReformReproduce = require("./API.bs.js");
var ReludeReact_Reducer = require("relude-reason-react/src/ReludeReact_Reducer.bs.js");

function get(state, field) {
  switch (field) {
    case /* UserId */0 :
        return state.userId;
    case /* Title */1 :
        return state.title;
    case /* Body */2 :
        return state.body;
    
  }
}

function set(state, field, value) {
  switch (field) {
    case /* UserId */0 :
        return {
                userId: value,
                title: state.title,
                body: state.body
              };
    case /* Title */1 :
        return {
                userId: state.userId,
                title: value,
                body: state.body
              };
    case /* Body */2 :
        return {
                userId: state.userId,
                title: state.title,
                body: value
              };
    
  }
}

var StateLenses = {
  get: get,
  set: set
};

var CreateForm = ReForm$BsReform.Make({
      set: set,
      get: get
    });

function Form$FieldNumber(Props) {
  var field = Props.field;
  var label = Props.label;
  return React.createElement(CreateForm.Field.make, {
              field: field,
              render: (function (param) {
                  var validate = param.validate;
                  var handleChange = param.handleChange;
                  return React.createElement("section", undefined, React.createElement("label", undefined, React.createElement("span", undefined, label), React.createElement("input", {
                                      value: String(param.value),
                                      onBlur: (function (param) {
                                          return Curry._1(validate, /* () */0);
                                        }),
                                      onChange: (function (param) {
                                          return Helpers$BsReform.handleChange(handleChange, param);
                                        })
                                    }), React.createElement("span", undefined, Belt_Option.getWithDefault(param.error, ""))));
                })
            });
}

var FieldNumber = {
  make: Form$FieldNumber
};

function Form$FieldString(Props) {
  var field = Props.field;
  var label = Props.label;
  return React.createElement(CreateForm.Field.make, {
              field: field,
              render: (function (param) {
                  var validate = param.validate;
                  var handleChange = param.handleChange;
                  return React.createElement("section", undefined, React.createElement("label", undefined, React.createElement("span", undefined, label), React.createElement("input", {
                                      value: param.value,
                                      onBlur: (function (param) {
                                          return Curry._1(validate, /* () */0);
                                        }),
                                      onChange: (function (param) {
                                          return Helpers$BsReform.handleChange(handleChange, param);
                                        })
                                    }), React.createElement("span", undefined, Belt_Option.getWithDefault(param.error, ""))));
                })
            });
}

var FieldString = {
  make: Form$FieldString
};

var initialState = {
  post: Relude_AsyncResult.init
};

function reducer(state, action) {
  switch (action.tag | 0) {
    case /* CreatePost */0 :
        return /* UpdateWithIO */Block.__(5, [
                  {
                    post: Relude_AsyncResult.toBusy(state.post)
                  },
                  Relude_IO.bimap((function (s) {
                          return /* PostSuccess */Block.__(1, [s]);
                        }), (function (e) {
                          return /* PostError */Block.__(2, [e]);
                        }), API$ReformReproduce.Posts.create(action[0]))
                ]);
    case /* PostSuccess */1 :
        return /* Update */Block.__(0, [{
                    post: Relude_AsyncResult.completeOk(action[0])
                  }]);
    case /* PostError */2 :
        return /* Update */Block.__(0, [{
                    post: Relude_AsyncResult.completeError(action[0])
                  }]);
    
  }
}

function Form(Props) {
  var match = ReludeReact_Reducer.useReducer(reducer, initialState);
  var send = match[1];
  var form = Curry._7(CreateForm.use, {
        userId: 0,
        title: "",
        body: ""
      }, /* Schema */[[
          /* StringNonEmpty */Block.__(2, [/* Title */1]),
          /* StringNonEmpty */Block.__(2, [/* Body */2]),
          /* IntMin */Block.__(6, [
              /* UserId */0,
              0
            ])
        ]], (function (param) {
          var state = param.state;
          console.log("Form State (different type of userId) \n I Need INT", state.values);
          Curry._1(send, /* CreatePost */Block.__(0, [{
                    userId: state.values.userId,
                    title: state.values.title,
                    body: state.values.body
                  }]));
          return ;
        }), undefined, undefined, /* OnDemand */1, /* () */0);
  return React.createElement(CreateForm.Provider.make, Curry._3(CreateForm.Provider.makeProps, form, React.createElement("form", {
                      onSubmit: (function (e) {
                          e.preventDefault();
                          return Curry._1(form.submit, /* () */0);
                        })
                    }, React.createElement(Form$FieldNumber, {
                          field: /* UserId */0,
                          label: "User"
                        }), React.createElement(Form$FieldString, {
                          field: /* Title */1,
                          label: "Title"
                        }), React.createElement(Form$FieldString, {
                          field: /* Body */2,
                          label: "Body"
                        }), React.createElement("input", {
                          type: "submit",
                          value: "Submit"
                        }), React.createElement("section", undefined, "Form state:" + JSON.stringify(API$ReformReproduce.Posts.t_encode({
                                  userId: form.state.values.userId,
                                  title: form.state.values.title,
                                  body: form.state.values.body
                                }), null, 2)), React.createElement("section", undefined, ReludeReact_Render.asyncResultByValueLazy((function (param) {
                                return React.createElement("span", undefined, "Loading...");
                              }), (function (s) {
                                return React.createElement("span", undefined, "Success create\n", "Reponse :" + JSON.stringify(API$ReformReproduce.Posts.response_encode(s), null, 2));
                              }), (function (e) {
                                return React.createElement("span", undefined, API$ReformReproduce.$$Error.show(e));
                              }), match[0].post))), /* () */0));
}

var make = Form;

exports.StateLenses = StateLenses;
exports.CreateForm = CreateForm;
exports.FieldNumber = FieldNumber;
exports.FieldString = FieldString;
exports.initialState = initialState;
exports.reducer = reducer;
exports.make = make;
/* CreateForm Not a pure module */
