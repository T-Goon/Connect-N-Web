var width = 1000;
var height = 500;
var shadowOffset = 20;
var tween = null;
var blockSnapSize = 30;

var boardWidth = null;
var boardHeight = null;

const player1_color = 'red';
const player2_color = 'black';
var human_color = player1_color;
var AI_color = player2_color;

const circleRadius = 34.5;

var circle_y_spacing = null;

var x_locs = []; // X coord of each column on game board

var board = new Board(7, 6);

var stage = new Konva.Stage({
    container: 'game-container',
    width: width,
    height: height
});

// Konva layers
var layer = new Konva.Layer();
var shadow_layer = new Konva.Layer();
var board_layer = new Konva.Layer();

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
});

/**
 * Main function.
 */
function main() {

    reset_konva_board();

    // Add circle to show snapping of peices to board columns
    shadowCircle.hide();
    shadow_layer.add(shadowCircle);

    new_game_peice(boardWidth + 50, boardHeight / 2, layer, stage);

    stage.add(board_layer);
    stage.add(shadow_layer);
    stage.add(layer);

    // Reset value of all dropdowns to default
    document.getElementById('player_select').value = '1';
    document.getElementById('board_width_select').value = '7';
    document.getElementById('board_height_select').value = '6';
    document.getElementById('num_tokens_select').value = '4';
}

function reset_konva_board() {

    boardHeight = 10 + (circleRadius * 2.5 * board.height);
    boardWidth = 50 + (circleRadius * 3.5 * board.width);

    circle_y_spacing = boardHeight / board.height;

    // Cache x locations of the placed circles
    x_locs = new Array();
    for (let i = circleRadius + 25; i < boardWidth; i += boardWidth / board.width)
        x_locs.push(i);

    stage.width(boardWidth + 100);
    stage.height(boardHeight + 10);

    board_layer.destroyChildren();
    // Lines for board border
    board_layer.add(new Konva.Rect({
        x: 0,
        y: 0,
        width: boardWidth,
        height: boardHeight,
        stroke: 'black',
        strokeWidth: 5,
        fill: 'blue'
    }));

    // Empty circles for the game pieces on the board
    for (let j = circleRadius + 10; j < boardHeight; j += boardHeight / board.height) {
        for (let i = 0; i < board.width; i++) {
            board_layer.add(new Konva.Circle({
                x: x_locs[i],
                y: j,
                radius: circleRadius,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 4
            }));
        }
    }
}

function reset_x_locs() {

}

/**
 * Gets the y coordinate of where a game peice should be placed on the board in a given row.
 * @param {int} index Index of the column to place a game peice in.
 * @returns y coordinate of where a game peice should be placed in a given row.
 */
function get_y_coord(index) {
    return circleRadius + 10 + (board.height - 1 - board.num_peices_in_cols[index]) * circle_y_spacing;
}

/**
 * Places a Konva circle as the game peice for the AI player.
 * @param {float} x x coordinate on the Konva stage to place the circle
 * @param {float} y y coordinate on the Konva stage to place the circle
 * @param {Konva.Layer} layer The Konva layer to place the circle in.
 */
function new_opponent_token(x, y, layer) {

    // Create circle
    let opponent_token = new Konva.Circle({
        x: x,
        y: y,
        radius: circleRadius,
        fill: AI_color,
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
 * Notify server about the player's move in the game
 * @returns [0|1|2] Player number of the winner of the game. 0 if noone won.
 * [1|2] if AI has won the game.
 */
async function AI_move() {
    const data = {
        board: board.board,
        board_width: board.width,
        board_height: board.height,
        board_num_win: board.num_win,
        player: board.player
    };

    let winner = 0;

    await $.ajax({
        url: '/move', // route to execute
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        type: 'POST',
        success: (res) => {

            board.board = res.board;

            // place an opponent token
            new_opponent_token(x_locs[res.move], get_y_coord(res.move), layer);
            board.num_peices_in_cols[res.move]++;

            // Check for AI win
            winner = res.win;
        },
        error: (error) => {
            show_error();
        }
    });

    return winner;
}

/**
 * Creates a circle that acts as a new game peice.
 * @param {float} x Initial x coordinate to place the circle
 * @param {float} y Initial y coordinate to place the circle
 * @param {Konva.Layer} layer Layer to place the circle in
 * @param {Konva.Stage} stage Stage to place the circle in
 */
function new_game_peice(x, y, layer, stage) {

    // Create circle
    let circle = new Konva.Circle({
        x: x,
        y: y,
        radius: circleRadius,
        fill: human_color,
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

        if (board.num_peices_in_cols[index_x] >= board.height) { // Column on the game board is full

            // Return to original position
            circle.position({
                x: x,
                y: y
            });

            stage.batchDraw();
            shadowCircle.hide();
            return;
        }


        // Column on the game board is not full

        // Place game peice
        circle.position({
            x: closest_x,
            y: new_y_pos
        });
        circle.draggable(false);

        // Increment num peices in row
        board.num_peices_in_cols[index_x]++;

        stage.batchDraw();
        shadowCircle.hide();

        // Add player token to board array
        board.add_token(index_x);

        // Check for a player win
        let winner = board.get_outcome();

        // Tell server about placement so AI can take turn
        // Only if player has not already won
        if (winner == 0 && board.free_cols().length != 0)
            winner = await AI_move();

        if (winner != 0 || board.free_cols().length == 0) {
            // Show a message if the game has ended
            let msg = '';
            let color = '';

            // Change message depending on game outcome
            if (winner == board.player) {
                msg = 'YOU WIN!!! :)';
                color = 'green';
            } else if (winner == (board.player % 2 + 1)) {
                msg = 'YOU LOSE :(';
                color = 'red';
            } else {
                msg = 'TIE';
                color = 'yellow';
            }

            let text = new Konva.Text({
                x: boardWidth / 4,
                y: boardHeight / 2.5,
                width: boardWidth / 2,
                text: msg,
                fontSize: 50 / (7 / board.height),
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

            return;
        }

        // Game peice placed successfully, create a new one
        // only if AI has not won or game is tied
        new_game_peice(boardWidth + 50, boardHeight / 2, layer, stage);
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

/**
 * Resets the game state.
 */
function restart_game() {

    // Remove game peices from Konva layer
    layer.destroyChildren();
    stage.batchDraw();

    // Allows human to swap between player 1 and player 2
    let select = document.getElementById('player_select');
    board.player = parseInt(select.value);

    select = document.getElementById('board_width_select');
    let num_cols = parseInt(select.value);
    board.width = num_cols;

    select = document.getElementById('board_height_select');
    let num_rows = parseInt(select.value);
    board.height = num_rows;

    select = document.getElementById('num_tokens_select');
    let num_win = parseInt(select.value);
    board.num_win = num_win;

    reset_konva_board();

    // Reset board state variables
    board.reset_num_peices_in_cols();
    board.reset_board();

    // AI move now if the human is player 2
    if (board.player == 1) {
        human_color = player1_color;
        AI_color = player2_color;
    } else {
        AI_color = player1_color;
        human_color = player2_color;
        AI_move();
    }

    // Make new player game peice on the right
    new_game_peice(boardWidth + 50, boardHeight / 2, layer, stage);
}

function show_error() {
    let text = new Konva.Text({
        x: boardWidth / 4,
        y: boardHeight / 2.5,
        width: boardWidth / 2,
        text: 'An error has occured. Please reload the page.',
        fontSize: 50 / (7 / board.height),
        fontFamily: 'Calibri',
        fill: 'red',
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

main();