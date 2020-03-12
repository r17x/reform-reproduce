open Relude.Globals;
open BsReform;
open ReludeReact;

module StateLenses = [%lenses
  type state = {
    userId: int,
    title: string,
    body: string,
  }
];
module CreateForm = ReForm.Make(StateLenses);
module FieldNumber = {
  [@react.component]
  let make = (~field, ~label) =>
    <CreateForm.Field
      field
      render={
        ({handleChange, error, value, validate}) =>
          <section>
            <label>
              <span> label->React.string </span>
              <input
                value=value->string_of_int
                onBlur={_ => validate()}
                onChange={Helpers.handleChange(handleChange)}
              />
              <span>
                {React.string(error->Belt.Option.getWithDefault(""))}
              </span>
            </label>
          </section>
      }
    />;
};
module FieldString = {
  [@react.component]
  let make = (~field, ~label) =>
    <CreateForm.Field
      field
      render={
        ({handleChange, error, value, validate}) =>
          <section>
            <label>
              <span> label->React.string </span>
              <input
                value
                onBlur={_ => validate()}
                onChange={Helpers.handleChange(handleChange)}
              />
              <span>
                {React.string(error->Belt.Option.getWithDefault(""))}
              </span>
            </label>
          </section>
      }
    />;
};

type state = {post: AsyncResult.t(API.Posts.response, API.Error.t)};

type action =
  | CreatePost(API.Posts.t)
  | PostSuccess(API.Posts.response)
  | PostError(API.Error.t);

let initialState = {post: AsyncResult.init};
let reducer = (state, action): ReludeReact.Reducer.update(action, state) =>
  switch (action) {
  | CreatePost(d) =>
    UpdateWithIO(
      {post: state.post |> AsyncResult.toBusy},
      API.Posts.create(d)
      |> Relude.IO.bimap(s => PostSuccess(s), e => PostError(e)),
    )
  | PostSuccess(s) => Update({post: AsyncResult.completeOk(s)})
  | PostError(e) => Update({post: AsyncResult.completeError(e)})
  };
[@react.component]
let make = () => {
  let (state, send) = Reducer.useReducer(reducer, initialState);
  let form =
    CreateForm.use(
      ~validationStrategy=OnDemand,
      ~schema=
        CreateForm.Validation.Schema([|
          StringNonEmpty(Title),
          StringNonEmpty(Body),
          IntMin(UserId, 0),
        |]),
      ~onSubmit=
        ({state}) => {
          Js.log2(
            "Form State (different type of userId) \n I Need INT",
            state.values,
          );
          CreatePost({
            userId: state.values.userId,
            title: state.values.title,
            body: state.values.body,
          })
          ->send;
          None;
        },
      ~initialState={title: "", body: "", userId: 0},
      (),
    );
  let createWithoutForm = _ =>
    CreatePost({
      userId: 99,
      title: "Create Without Form",
      body: "Create Without Form",
    })
    ->send;
  <CreateForm.Provider value=form>
    <form
      onSubmit={
        e => {
          ReactEvent.Synthetic.preventDefault(e);
          form.submit();
        }
      }>
      <FieldNumber field=StateLenses.UserId label="User" />
      <FieldString field=StateLenses.Title label="Title" />
      <FieldString field=StateLenses.Body label="Body" />
      <input type_="submit" value="Submit" />
      <button onClick=createWithoutForm>
        "Create Post without Form"->React.string
      </button>
      <section>
        {
          React.string(
            "Form state:"
            ++ Js.Json.stringifyWithSpace(
                 API.Posts.t_encode({
                   userId: form.state.values.userId,
                   title: form.state.values.title,
                   body: form.state.values.body,
                 }),
                 2,
               ),
          )
        }
      </section>
      <section>
        {
          state.post
          |> ReludeReact.Render.asyncResultByValueLazy(
               _ => <span> "Loading..."->React.string </span>,
               s =>
                 <span>
                   "Success create\n"->React.string
                   {
                     React.string(
                       "Reponse :"
                       ++ Js.Json.stringifyWithSpace(
                            s->API.Posts.response_encode,
                            2,
                          ),
                     )
                   }
                 </span>,
               e => <span> {React.string(API.Error.show(e))} </span>,
             )
        }
      </section>
    </form>
  </CreateForm.Provider>;
};
