# Middle-Race (Front End)
Turn based multiplayer racing game where the goal is to finish in the middle.

### Starting MiddleRace
Run react-native run-ios in Node.js to start the simulator. Make sure you have xCode installed.

# Game Details
Turn based multiplayer racing game where the goal is to finish in the middle. Players are give special abilities that trigger when certain conditions are met. Cooperation and betrayal are intrinsic values for winning this race. Built using React-Native for IOS.

## Choosing a character
Before you begin a game of Middle-Race, all the players in the game must select a character. There are 13 characters to choose from, each with a unique ability. Every person must choose a different character.

You can scroll left and right to view which characters are available.


![](images/demoPic5.png)


Tap on a character to view more details. I've highlighted two of my favorite characters below:


![](images/demoPic6.png)
![](images/demoPic7.png)


When all the players have picked a character, you are ready to begin the game!

## Gameplay
Middle-Race is a turn based multiplayer game where the goal is to finish as close to the middle as possible. Players are given move cards that move them forward the track, as well as special abilities that can either passively or actively affect the board state.


![](images/demoPic1.png)
*An example of a game in progress.*

Special abilities are either activated on your turn or automatically activates when certain conditions are met. For example, the character WolfAbhi has the ability to push players sharing the same space as him either one space forward or backwards, as shown below.


![](images/demoPic3.png)


When players with passive abilities like Wolf Abhi's are making their decision, the other players must wait for the choice to be made. This is the screen other players see while Wolf Abhi makes his choice:


![](images/demoPic4.png)


Characters with active abilities can activate their abilities on their turn, often at the cost of a move card. For example, Swag Abhi has the ability to pull any character either one space ahead of below him by giving up a card, as shown below:


![](images/demoPic8.png)
![](images/demoPic9.png)


## Victory conditions

The goal is to finish the race as close to the middle as possible. For example, if there are 10 players in a game, the players who come 5th and 6th will be considered the victors, while the players coming first and last will be considered dead last.

While each special ability to weak on it's own, powerful effects can occur when they are combined. Thus, it is in your best interest to form alliances with other players in the game. However, to secure the winning position, you must be ready to betray your friends!

Since this game works best as a team game, players consider having forced teams, or assigning points to each ending position and summing up their team's points at the end of the game to decide the winner.

## Inspiration

This game is based off a game from a Korean gameshow called [The Genius](https://en.wikipedia.org/wiki/The_Genius_(TV_series)).

[View the summary of the game in the show here](http://the-genius.wikia.com/wiki/Middle_Race)

[Watch Season 3 Episode 3 for the first rendition of Middle Race.](https://www.reddit.com/r/koreanvariety/comments/2joq50/the_genius_s3e03_middle_race/)

[Watch Season 3 Episode 9 for the second rendition of Middle Race.](https://www.reddit.com/r/koreanvariety/comments/2nrxfl/the_genius_s3e09_middle_race/)

The characters are based off the coFounders of Horizons School of Technology.

# Production details

This game was built over three days for a Horizons multiplayer-mobile-game-themed hackathon. The game is built on React-Native, and the database is hosted on MongoDb and Gomix. The game is currently unfinished, having only three of thirteen character abilities implemented.

## Features yet to be added

* Ten more character abilities.
* Real-time update utilizing socket.io rather than current hacky solution.
* Improved game interface.
* Game spectate.
* In-game rule book.
* In-game exit game.
* Points for winning.
* Additional game customization options when creating new game. (E.g. select max players).
* Auto update for game list.

## Changelog

### 0.3.1

* Fixed API urls and updated README.md.

### 0.3.0

* Special abilities functionality implemented for the following characters: Wolf Abhi, Swag Abhi, Classic Abhi.
* Real time update implemented for games (no need to refresh the app).

### 0.2.1

* Characters now move on the board to reflect their position.

### 0.2.0

* Game board implemented.
* Move cards and moving implemented.
* Next player feature implemented.

### 0.1.0

* Character selection implemented.
* Character descriptions and special ability descriptions added.
* Backend with API built.

### 0.0.0

* Initial Version.
* Register and login functionality added.
* Add new game and join open game features added.
