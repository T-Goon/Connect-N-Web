const Board = require("./board");

let b = new Board(1, 2, 3, 4);
console.log(b.height);
b.copy();