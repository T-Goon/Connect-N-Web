var width = document.getElementById('game-container').offsetWidth;
if (width < 1000) width = 1000;
var height = window.innerHeight - 50;
if (height < 500) height = 500;
var shadowOffset = 20;
var tween = null;
var blockSnapSize = 30;

// var boardWidth = (width / 2);
const boardWidth = 902;
// var boardHeight = (height / 1.8);
const boardHeight = 492;

// var circleRadius = ((width + height) / 2) / 39;
const circleRadius = 34.5;

var padding = blockSnapSize;

const circle_y_spacing = boardHeight / 6;

var x_locs = [];
var num_peices_in_cols = [0, 0, 0, 0, 0, 0, 0];

var num_board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

var stage = new Konva.Stage({
    container: 'game-container',
    width: width,
    height: height
});

// Konva layers
var layer = new Konva.Layer();
var boardLayer = new Konva.Layer();

/**
 * Gets the y coordinate of where a game peice should be placed on the board in a given row.
 * @param {int} index Index of the column to place a game peice in.
 * @returns y coordinate of where a game peice should be placed in a given row.
 */
function get_y_coord(index) {
    return circleRadius + 10 + (5 - num_peices_in_cols[index]) * circle_y_spacing;
}

// Opponent Token
function new_opponent_token(x, y, layer) {

    // Create circle
    let opponent_token = new Konva.Circle({
        x: x,
        y: y,
        radius: circleRadius,
        fill: 'black',
        stroke: '#ddd',
        strokeWidth: 1,
        shadowColor: 'black',
        shadowBlur: 2,
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.4
    });

    layer.add(opponent_token);
}
/**
 * Add token to number representation of the board.
 * @param {int} col Column to place the token in, assumed valid.
 */
function add_token(col) {
    // Find empty slot for token
    let row = 0;

    // Walk up column until an empy spot is found
    while (num_board[row][col] != 0)
        row = row + 1;

    num_board[row][col] = 1;
}

async function check_player_win(player) {
    const data = {
        board: num_board
    }

    let winner = 0;

    await $.ajax({
        url: '/check_player_win', // route to execute
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        type: 'POST',
        success: (res) => {

            winner = res.win;
        },
        error: (error) => {
            console.log('Error: ' + error);
        }
    });

    return winner;
}

/**
 * Notify server about the player's move in the game
 * @param {int} col Index of column on board to place game peice
 * @returns [0|1|2] Player number of the winner of the game. 0 if noone won.
 * [1|2] if AI has won the game.
 */
async function move(col) {
    const data = {
        board: num_board,
        player: 1
    };

    let winner = 0;

    await $.ajax({
        url: '/move', // route to execute
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        type: 'POST',
        success: (res) => {

            num_board = res.board;

            // place an opponent token
            new_opponent_token(x_locs[res.move], get_y_coord(res.move), layer);
            num_peices_in_cols[res.move]++;

            // Check for AI win
            winner = res.win;
        },
        error: (error) => {
            console.log('Error: ' + error);
        }
    });

    return winner;
}

// Cache x locations of the placed circles
for (let i = circleRadius + 25; i < boardWidth; i += boardWidth / 7) {
    x_locs.push(i);
}

// Lines for board border
boardLayer.add(new Konva.Rect({
    x: 0,
    y: 0,
    width: boardWidth,
    height: boardHeight,
    stroke: 'black',
    strokeWidth: 5,
    fill: 'blue'
}));

// Empty circles for the game pieces on the board
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

/**
 * Creates a circle that acts as a new game peice.
 * @param {float} x Initial x coordinate to place the circle
 * @param {float} y Initial y coordinate to place the circle
 * @param {Konva.Layer} layer Layer to place the circle in
 * @param {Konva.Stage} stage Stage to place the circle in
 */
function newCircle(x, y, layer, stage) {

    // Create circle
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

    circle.on('dragend', async (e) => {

        // Closest x spot on the game board
        let closest_x = x_locs.reduce((a, b) => {
            return Math.abs(b - circle.x()) < Math.abs(a - circle.x()) ? b : a;
        });

        let index_x = x_locs.indexOf(closest_x);

        let new_y_pos = get_y_coord(index_x);

        if (num_peices_in_cols[index_x] < 6) {
            // Column on the game board is not full

            // Place game peice
            circle.position({
                x: closest_x,
                y: new_y_pos
            });
            circle.draggable(false);

            // Increment num peices in row
            num_peices_in_cols[index_x]++;

            stage.batchDraw();
            shadowCircle.hide();

            // Add player token to board array
            add_token(index_x);

            // Check for a player win
            let winner = await check_player_win(1);

            // Tell server about placement so AI can take turn
            // Only if player has not already won
            if (winner == 0)
                winner = await move(index_x);

            // Game peice placed successfully, create a new one
            // only if AI has not won
            if (winner == 0)
                newCircle(boardWidth + 50, boardHeight / 2, layer, stage);
            else {
                let msg = '';
                let color = '';

                if (winner == 1) {
                    msg = 'YOU WIN!!! :)';
                    color = 'green';
                } else {
                    msg = 'YOU LOSE :(';
                    color = 'red';
                }

                let text = new Konva.Text({
                    x: boardWidth / 4,
                    y: boardHeight / 2.5,
                    width: boardWidth / 2,
                    text: msg,
                    fontSize: 50,
                    fontFamily: 'Calibri',
                    fill: color,
                    padding: 20,
                    align: 'center'
                });

                var rect = new Konva.Rect({
                    x: boardWidth / 4,
                    y: boardHeight / 2.5,
                    stroke: '#555',
                    strokeWidth: 5,
                    fill: '#ddd',
                    width: boardWidth / 2,
                    height: text.height(),
                    shadowColor: 'black',
                    shadowBlur: 10,
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
                    shadowOpacity: 0.2,
                    cornerRadius: 10,
                });

                layer.add(rect);
                layer.add(text);
            }

        } else {
            // Column on the game board is full

            // Return to original position
            circle.position({
                x: x,
                y: y
            });

            stage.batchDraw();
            shadowCircle.hide();
        }

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

shadowCircle.hide();
layer.add(shadowCircle);
newCircle(boardWidth + 50, boardHeight / 2, layer, stage);

stage.add(boardLayer);
stage.add(layer);