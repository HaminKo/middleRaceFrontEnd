# Horizons Hackathon Template.

## Steps 1: Get your project set-up
You have two ways of working on your project: Local and Gomix.

### Local development
1. Clone the repo.
1. Create a `env.sh` file that contains:

  ```
  export MONGODB_URI='YOUR URI';
  export SECRET='YOUR SECRET'
  ```

1. Run `source .env`, and you are good to go!

### Gomix Development

1. Go to https://gomix.com/#!/project/express-template and click
  `Remix this 🎤`
1. Select `.env` on the left panel, add your `MONGODB_URI` and `SECRET`
1. Click `Show` at the top to preview your app!

## Backend API Reference

**Base URL:** https://middle-race.gomix.me/

All endpoints accept JSON data and return JSON data. All responses include
a boolean `success` field that indicates if request was successful.
You can also use the response status code to figure out if a request
was successful.


- `Get /games'`: Get a list of all games, completed and ongoing.
  - Parameters:
    - `username`: Required String
    - `password`: Required String
  - Response codes:
- `Get /games/:id`: Get game details of a specific game.
  - Example response:

    ```javascript
    {
      "success": true,
      "game": {
        "_id": "58b8d8d0b6d420258819dd4d",
        "gameName": "testgame4",
        "__v": 0,
        "gamePlayerLimit": 5,
        "gameStatus": "Not Started",
        "users": [
          {
            "id": "58b8b01b5680f430f18f6064",
            "name": "test2",
            "_id": "58b8d8d0b6d420258819dd4e",
            "pictureSRC": null,
            "currentTurn": false,
            "moveCards": [],
            "character": "none",
          }
        ]
      }
    }
    ```

- `POST /games/create'`: Create a new game.
  - Parameters:
    - `gameName`: req.body.gameName,
  - Response codes:
    - `401`: User is not logged in
    - `200`: The game is made

- `POST /games/join/:id`: Join an existing game.
  - Parameters: **none**
  - Response codes:
    - `401`: User is not logged in
    - `200`: User joined the game

- `POST /games/chooseCharacter/:id`: Choose a character for a user.
  - Parameters:
    - `gameName`: req.body.character,
  - Response codes:
    - `401`: User is not logged in
    - `200`: Character chosen

- `POST /games/makeMove/:id`: When a player uses a move card.
  - Parameters:
    - `gameName`: req.body.moveCards,
    
  - Example req.body.moveCards:

  ```javascript
  [
    {moveAmount: 1},
    {moveAmount: 2},
    {moveAmount: 3},
    {moveAmount: 4}
  ]
  ```
    
  - Response codes:
    - `401`: User is not logged in
    - `200`: Card succesfully used

- `POST /games/updateCurrentPlayer/:id`: Update the current player to play in a game.
  - Parameters:
    - Parameters: **none**
  - Response codes:
    - `401`: User is not logged in
    - `200`: Current player succesfully updated

- `POST /games/updateGameStatus`: Update current game status from "Not started" to "Ongoing" to "Completed".
  - Parameters:
    - `gameName`: req.body.gameStatus,
  - Response codes:
    - `401`: User is not logged in
    - `200`: Game status succesfully updated

- `POST /games/updatePlayerPosition/:id`: Update the position of the players on the racetrack.
  - Parameters:
    - `gameName`: req.body.position,

  - Example req.body.moveCards:

  ```javascript
  [
    {moveAmount: 1},
    {moveAmount: 2},
    {moveAmount: 3},
    {moveAmount: 4}
  ]
    
  - Response codes:
    - `401`: User is not logged in
    - `200`: Player positions succesfully updated
