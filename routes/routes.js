var express = require('express');
var router = express.Router();
var models = require('../models');
var _ = require('underscore');
var User = models.User;
var Game = models.Game
var Character = require('../characters')

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

router.post('/games/create', function(req, res, next) {
  var newGame = new Game ({
    gameName: req.body.gameName,
    users: [{
      id: req.user._id,
      name: req.user.username
    }]
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
    } else if (game.users.filter((user) => user.id === JSON.stringify(req.user._id)).length > 0) {
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
            game: gameUpdate
          });
        }
      });
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
    } else if (game.users.filter((user) => (user.character === req.body.character)).character !== 'none') {
      res.status(400).json({
        success: false,
        error: "Character already chosen!"
      });      
    } else if (game.users.filter((user) => (user.character === req.body.character)).length > 0 ) {
      res.status(400).json({
        success: false,
        error: "Character already used!"
      });
    } else {  
      var updateUserIndex = game.users.map(function(user) { return user.id; }).indexOf(JSON.stringify(req.user._id));
      var updateUserArray = game.users[updateUserIndex].character = req.body.character;
      game.update({
        users: updateUserArray
       }, function(err, contact) {
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
    } else if (game.users[game.currentPlayer].id !== req.user._id) {
      res.status(400).json({
        success: false,
        error: "Currently not your turn!"
      });
    } else {  
      var updateUserIndex = game.users.map(function(user) { return user.id; }).indexOf(JSON.stringify(req.user._id));
      var updateUserArray = game.users[updateUserIndex].moveCards = req.body.moveCards
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

router.post('/games/updateCurrentPlayer/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });     
    } else {  
      var currentPlayerCount = function(index) {
        index++
        if (index > 5) {
          return index = 1
        } else {
          return index
        }
      }
      var currentPlayerCount = 
      game.update({
        currentPlayer: currentPlayerCount(game.currentPlayer)
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

router.post('/games/updatePlayerPosition/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });     
    } else { 
      var updateUserArray = game.users
      for (var i = 0; i < req.body.playerPositions.length; i++) {
        updateUserArray[i].position = req.body.playerPositions[i]
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
