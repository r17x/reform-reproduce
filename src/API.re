open Relude.Globals;
open ReludeFetch;
module Error = {
  type t = ReludeFetch.Error.t(string);
  let show = error => ReludeFetch.Error.show(a => a, error);
  module Type = {
    type nonrec t = t;
  };
};

module IOE = IO.WithError(Error.Type);
open IOE.Infix;

module Posts = {
  [@decco]
  type t = {
    userId: int,
    title: string,
    body: string,
  };
  [@decco]
  type response = {id: int};

  let url = "https://jsonplaceholder.typicode.com/posts";

  let make = (~userId, ~title, ~body) => {userId, title, body};

  let decode: Js.Json.t => Result.t(response, string) =
    json => json->response_decode |> Result.mapError(_ => "Decode failed");

  let create = (formData: t): IO.t(response, Error.t) =>
    fetchWith(~method_=Fetch.Post, ~body=formData->t_encode->Json, url)
    >>= decode->Response.Json.decode;
};
