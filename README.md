# Connect4-Web

A web app where you can play Connect 4 VS an AI using the negamax algorithm.

The app is deployed on Heroku and can be found here: https://connect-4-web.herokuapp.com/.

![image](https://user-images.githubusercontent.com/32044950/124662595-0e75ae80-de77-11eb-84e8-ef7ff19e5eaf.png)

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
