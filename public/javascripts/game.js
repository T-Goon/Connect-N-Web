var width = document.getElementById('game-container').offsetWidth;
var height = window.innerHeight - 50;
var shadowOffset = 20;
var tween = null;
var blockSnapSize = 30;

var boardWidth = (width / 2);
var boardHeight = (height / 1.8);

var circleRadius = width / 50;

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

function newCircle(x, y, layer, stage) {
    let circle = new Konva.Circle({
        x: x,
        y: y,
        radius: circleRadius,
        fill: '#fff',
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
        circle.position({
            x: Math.round(circle.x() / blockSnapSize) * blockSnapSize,
            y: Math.round(circle.y() / blockSnapSize) * blockSnapSize
        });
        stage.batchDraw();
        shadowCircle.hide();
    });
    circle.on('dragmove', (e) => {
        shadowCircle.position({
            x: Math.round(circle.x() / blockSnapSize) * blockSnapSize,
            y: Math.round(circle.y() / blockSnapSize) * blockSnapSize
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

var boardLayer = new Konva.Layer();
var padding = blockSnapSize;

// Lines for board border
console.log(width, padding, width / padding);
boardLayer.add(new Konva.Rect({
    x: 0,
    y:0,
    width: boardWidth,
    height: boardHeight,
    stroke: 'black',
    strokeWidth: 5,
    fill: 'blue'
}));

// Empty circles for the game pieces
for (let j = circleRadius + 10; j < boardHeight; j += boardHeight / 6) {
    for (let i = circleRadius + 25; i < boardWidth; i += boardWidth / 7) {
        boardLayer.add(new Konva.Circle({
            x: i,
            y: j,
            radius: circleRadius,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 4
        }));
    }
}

var layer = new Konva.Layer();
shadowCircle.hide();
layer.add(shadowCircle);
newCircle(blockSnapSize * 3, blockSnapSize * 3, layer, stage);
newCircle(blockSnapSize * 10, blockSnapSize * 3, layer, stage);

stage.add(boardLayer);
stage.add(layer);