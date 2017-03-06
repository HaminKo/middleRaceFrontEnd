var express = require('express');
var router = express.Router();
var models = require('../models');
var _ = require('underscore');
var User = models.User;
var Game = models.Game
var Characters = require('../characters')

//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes

router.get('/', function(req, res, next) {
  res.render('home');
});

///////////////////////////// END OF PUBLIC ROUTES /////////////////////////////

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

//////////////////////////////// PRIVATE ROUTES ////////////////////////////////
// Only logged in users can see these routes

router.get('/protected', function(req, res, next) {
  res.render('protectedRoute', {
    username: req.user.username,
  });
});

router.get('/games', function(req, res, next) {
  Game
  .find()
  .exec(function(err, games) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    } else {
      res.json({
        success: true,
        games: games
      });
    }
  });
});

router.get('/games/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {})
  .exec(function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    } else {
      res.json({
        success: true,
        game: game,
        user: req.user
      });
    }
  });
});

router.get('/characters', function(req, res, next) {
  res.json({
    success: true,
    characters: Characters.Characters
  })
});

router.post('/games/create', function(req, res, next) {
  var newGame = new Game ({
    gameName: req.body.gameName,
    users: [{
      id: req.user._id,
      name: req.user.username
    }],
    currentPlayerIndex: 0
  });
  newGame.save(function(err, game) {
    if (err) {
      console.log('error', err);
      res.status(400).json({
        success: false,
        error: err.message
      });
    } else {
      res.json({
        success: true,
        game: game
      });
    }
  });
});

//Delete in 10mins
router.post('/temp/:id', function(req,res){
  res.json({
    success:true
  });
});

router.post('/games/join/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    } else if (game.users.filter((user) => JSON.stringify(user.id) === JSON.stringify(req.user._id)).length > 0) {
      res.status(400).json({
        success: false,
        error: "You already joined this game!"
      });
    } else if (game.users.length === game.gamePlayerLimit ) {
      res.status(400).json({
        success: false,
        error: "Game is full!"
      });
    } else {
      if ((game.users.length + 1) === game.gamePlayerLimit) {
        game.update({
          currentPlayerIndex: 0,
          gameStatus: 'Ongoing',
          users: [...game.users,{
            id: req.user._id,
            name: req.user.username
          }]
         }, function(err, gameUpdate) {
          if (err) {
            console.log('error', err);
            res.status(400).json({
              success: false,
              error: err.message
            });
          } else {
            res.json({
              success: true,
              game: gameUpdate,
            });
          }
        });
      } else {
        game.update({
          users: [...game.users,{
            id: req.user._id,
            name: req.user.username
          }]
         }, function(err, gameUpdate) {
          if (err) {
            console.log('error', err);
            res.status(400).json({
              success: false,
              error: err.message
            });
          } else {
            res.json({
              success: true,
              game: gameUpdate,
            });
          }
        });
      }
    }
  });
});

router.post('/games/chooseCharacter/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    } else if (game.users.filter((user) => JSON.stringify(user.id) === JSON.stringify(req.user._id))[0].character !== 'none') {
      res.status(400).json({
        success: false,
        error: "You already have a character!",
      });      
    } else if (game.users.filter((user) => (JSON.stringify(user.character) === JSON.stringify(req.body.character))).length > 0 ) {
      res.status(400).json({
        success: false,
        error: "Character already used!"
      });
    } else {  
      var updateUserArray  = game.users.slice(0)
      var updateUserIndex = game.users.map(function(user) { return JSON.stringify(user.id); }).indexOf(JSON.stringify(req.user._id));
      updateUserArray[updateUserIndex].character = req.body.character;
      game.update({
        users: updateUserArray
       }, function(err, gameUpdate) {
        if (err) {
          console.log('error', err);
          res.status(400).json({
            success: false,
            error: err.message,
            test:' thiscalled'
          });
        } else {
          res.json({
            success: true,
            game: gameUpdate
          });
        }
      });
    }
  });
});

router.post('/games/makeMove/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });     
    } else if (game.gameStatus === "Completed") {
      res.status(400).json({
        success: false,
        error: "Game is over!"
      });
    } else if (game.users[game.currentPlayerIndex].id !== req.user._id) {
      res.status(400).json({
        success: false,
        error: "Currently not your turn!"
      });
    } else {
      var updateUserArray  = game.users.slice(0)
      var updateUserIndex = game.users.map(function(user) { return JSON.stringify(user.id); }).indexOf(JSON.stringify(req.user._id));
      updateUserArray[updateUserIndex].moveCards = req.body.moveCards
      game.update({
        users: updateUserArray
       }, function(err, game) {
        if (err) {
          console.log('error', err);
          res.status(400).json({
            success: false,
            error: err.message
          });
        } else {
          res.json({
            success: true,
            game: game
          });
        }
      });
    }
  });
});

router.post('/games/updateMoveCards/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });     
    } else if (game.gameStatus === "Completed") {
      res.status(400).json({
        success: false,
        error: "Game is over!"
      });
    } else {
      var updateUserArray = game.users.slice(0)
      var newMoveCardsArray = req.body.moveCardsArray.slice(0)
      for (var i = 0; i < newMoveCardsArray.length; i++) {
        updateUserArray[i].moveCards = newMoveCardsArray[i]
      }
      if (updateUserArray.slice(0) === game.users.slice(0)) {
        res.status(400).json({
          success: false,
          error: "No Cards to update!"
        });
      } else {
        game.update({
          users: updateUserArray
         }, function(err, game) {
          if (err) {
            console.log('error', err);
            res.status(400).json({
              success: false,
              error: err.message
            });
          } else {
            res.json({
              success: true,
              game: game
            });
          }
        });
      }
    }
  });
});

router.post('/games/updateCurrentPlayer/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });     
    } else {  
      var currentPlayerIndexCount = function(index) {
        index++
        if ((index + 1)> game.gamePlayerLimit) {
          return index = 0
        } else {
          return index
        }
      }
      game.update({
        currentPlayerIndex: currentPlayerIndexCount(game.currentPlayerIndex)
       }, function(err, game) {
        if (err) {
          console.log('error', err);
          res.status(400).json({
            success: false,
            error: err.message
          });
        } else {
          res.json({
            success: true,
            game: game
          });
        }
      });
    }
  });
});

router.post('/games/updateGameStatus', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });     
    } else {
      game.update({
        gameStatus: req.body.gameStatus
       }, function(err, game) {
        if (err) {
          console.log('error', err);
          res.status(400).json({
            success: false,
            error: err.message
          });
        } else {
          res.json({
            success: true,
            game: game
          });
        }
      });
    }
  });
});

router.post('/games/updatePlayerPositions/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });     
    } else { 
      var updateUserArray = game.users.slice(0)
      var newPlayerPositionsArray = req.body.playerPositionsArray.slice(0)
      for (var i = 0; i < newPlayerPositionsArray.length; i++) {
        updateUserArray[i].previousPosition = updateUserArray[i].position
        updateUserArray[i].position = newPlayerPositionsArray[i]
      }
      game.update({
        users: updateUserArray
       }, function(err, game) {
        if (err) {
          console.log('error', err);
          res.status(400).json({
            success: false,
            error: err.message
          });
        } else {
          res.json({
            success: true,
            game: game
          });
        }
      });
    }
  });
});

///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
