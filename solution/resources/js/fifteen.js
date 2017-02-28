// file: fifteen.js
// author: Bob Muller
//
// CSCI 2254 Web App Development
//
// A simple fifteen puzzle

function makeDiv(label) {
  let div = document.createElement("div");
  div.className = "inner";
  div.innerHTML = label;
  return div;
}

// range : int -> int list
//
function range(n) {
  let answer = [];
  for (let i = 0; i < n; i++)
    answer.push(i);
  return answer;
}

let hole = 15;

// openLeft : int * int array -> boolean
//
function openLeft(i, tiles) {
  return (i % 4 != 0) && tiles[i - 1] === hole;
}
function openRight(i, tiles) {
  return (i % 4 != 3) && tiles[i + 1] === hole;
}
function openAbove(i, tiles) {
  return (i >= 4) && tiles[i - 4] === hole;
}
function openBelow(i, tiles) {
  return (i <= 11) && tiles [i + 4] === hole;
}

// view : model * (event -> unit) -> element
//
function view(model, responder) {
  console.log("in view ..");
  let container = document.createElement('div');
  container.className = "main";
  for(let i = 0; i < 16; i++) {
    let div = makeDiv(model.tiles[i]);
    if (model.tiles[i] === hole)
      div.style.background = "white";
    div.addEventListener("click", responder);
    container.appendChild(div);
  }
  return container;
}

function swap(i, j, a) {
  let temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// return the index of tile n in the tiles.
function findTile(n, tiles) {
  for (let i = 0; i < 16; i++)
    if (tiles[i] === n) return i;
}

// update : event * model -> model
//
function update(event, model) {
  let n = parseInt(event.target.innerHTML);
  let i = findTile(n, model.tiles);

  if (openAbove(i, model.tiles)) {
    swap(i, i - 4, model.tiles);
    return model;
  }
  if (openRight(i, model.tiles)) {
    swap(i, i + 1, model.tiles);
    return model;
  }
  if (openBelow(i, model.tiles)) {
    swap(i, i + 4, model.tiles);
    return model;
  }
  if (openLeft(i, model.tiles))
    swap(i, i - 1, model.tiles);

  return model;
}

// makeModel : unit -> model
//
function makeModel() {
  let tiles = range(16);
  // shuffle the tiles.
  for(let i = 15; i > 0; i--) {
    let j = Math.floor(Math.random() * i) + 1;
    let temp = tiles[i];
    tiles[i] = tiles[j];
    tiles[j] = temp;
  }
  return {tiles: tiles};
}

// render : element -> unit
//
function render(element) {
  let main = document.getElementsByClassName('main')[0];
  document.body.removeChild(main);
  document.body.appendChild(element);
}

// start : app -> unit
//
function start(app) {
  console.log("starting app..");
  let model = makeModel();
  let cycle = function (event) {
    model = app.update(event, model);
    let element = app.view(model, cycle);
    render(element);
    }
  let e = app.view(model, cycle);
  render(e);
}

function launch(app) {
  console.log("Launching fifteen..");
  let responder = function (event) {
    document.body.removeEventListener("click", responder);
    start(app);
  }
  document.body.addEventListener("click", responder);
}

let app = {
  view: view,
  update: update,
  done:(model => model.done),
}

function go () { launch(app); }

window.onload = go
