var width = document.getElementById('game-container').offsetWidth;
var height = window.innerHeight - 50;
var shadowOffset = 20;
var tween = null;
var blockSnapSize = 30;

var boardWidth = (width / 2);
var boardHeight = (height / 1.8);

var circleRadius = ((width + height) / 2) / 39;

var boardLayer = new Konva.Layer();
var padding = blockSnapSize;

var circle_y_spacing = boardHeight / 6;

var x_locs = [];
var num_peices_in_cols = [0, 0, 0, 0, 0, 0, 0];

// Cache x locations of the placed circles
for (let i = circleRadius + 25; i < boardWidth; i += boardWidth / 7) {
    x_locs.push(i);
}

// Lines for board border
console.log(width, padding, width / padding);
boardLayer.add(new Konva.Rect({
    x: 0,
    y: 0,
    width: boardWidth,
    height: boardHeight,
    stroke: 'black',
    strokeWidth: 5,
    fill: 'blue'
}));

// Empty circles for the game pieces
for (let j = circleRadius + 10; j < boardHeight; j += boardHeight / 6) {
    for (let i = 0; i < 7; i++) {
        boardLayer.add(new Konva.Circle({
            x: x_locs[i],
            y: j,
            radius: circleRadius,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 4
        }));
    }
}

// Shows where the game peice will snap to when released
var shadowCircle = new Konva.Circle({
    x: 0,
    y: 0,
    radius: circleRadius,
    fill: '#FF7B17',
    opacity: 0.6,
    stroke: '#CF6412',
    strokeWidth: 3,
    dash: [20, 2]
})

function get_y_coord(index) {
    console.log((7 - num_peices_in_cols[index]) * circle_y_spacing);
    return circleRadius + 10 + (5 - num_peices_in_cols[index]) * circle_y_spacing;
}

// Creates a game peice
function newCircle(x, y, layer, stage) {
    let circle = new Konva.Circle({
        x: x,
        y: y,
        radius: circleRadius,
        fill: 'red',
        stroke: '#ddd',
        strokeWidth: 1,
        shadowColor: 'black',
        shadowBlur: 2,
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.4,
        draggable: true
    });
    circle.on('dragstart', (e) => {
        shadowCircle.show();
        shadowCircle.moveToTop();
        circle.moveToTop();
    });
    circle.on('dragend', (e) => {

        // Closest x spot on the game board
        let closest_x = x_locs.reduce((a, b) => {
            return Math.abs(b - circle.x()) < Math.abs(a - circle.x()) ? b : a;
        });

        let index_x = x_locs.indexOf(closest_x);

        circle.position({
            // Closest x spot on the game board
            x: closest_x,
            y: get_y_coord(index_x)
        });

        num_peices_in_cols[index_x] ++;

        stage.batchDraw();
        shadowCircle.hide();

        newCircle(boardWidth + 50, boardHeight / 2, layer, stage);
    });
    circle.on('dragmove', (e) => {
        // Closest x spot on the game board
        let closest_x = x_locs.reduce((a, b) => {
            return Math.abs(b - circle.x()) < Math.abs(a - circle.x()) ? b : a;
        });

        let index_x = x_locs.indexOf(closest_x);

        shadowCircle.position({
            x: closest_x,
            y: get_y_coord(index_x)
        });
        stage.batchDraw();
    });
    layer.add(circle);
}

var stage = new Konva.Stage({
    container: 'game-container',
    width: width,
    height: height
});

var layer = new Konva.Layer();
shadowCircle.hide();
layer.add(shadowCircle);
newCircle(boardWidth + 50, boardHeight / 2, layer, stage);

stage.add(boardLayer);
stage.add(layer);