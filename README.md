# ConnectN-Web

A web app where you can play Connect N, a varient of Connect 4, VS an AI using the Negamax algorithm. The app will allow the client to change the height and width of the board along with the number of game peices the players need to win the game.

The app has been deployed here: https://connect-n-web.herokuapp.com/

## Screenshots
![image](https://user-images.githubusercontent.com/32044950/125133018-33fef400-e0d3-11eb-88f4-522bfc73ec81.png)

![image](https://user-images.githubusercontent.com/32044950/125133117-598bfd80-e0d3-11eb-8bad-cae094539216.png)

## AI

The negamax AI used in this project was adapted and ported over to Node.js from https://github.com/T-Goon/ConnectN.

A description of the negamax AI algorithm and associated heuristics can be found here: https://github.com/T-Goon/ConnectN#readme.

## Files

### bin/www

File used to start the app. Contains config code for the server to listen on a port.

### app.js

Contains the Express app setup.

### Procfile

File specifically needed for depolyment on Heroku.

### agent.js alpha_beta_agent.js

Files that contain the logic for the Negamax AI algorithm.

### board.js

File that contains a class which represents a Connect N game board along with various utility functions.

### compute_agent_move.js

File which is run by worker threads in the POST '/move' route.

## Usage

Install dependencies with: `> npm install`

Run the app with: `> npm start`
