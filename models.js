var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// var characterSchema = mongoose.Schema({
//   characterName: {
//     type: String,
//     required: true
//   },
//   powerType: { //active or passive
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   ability: { //gravity,push,pull,with
//     type: String,
//     required: true
//   }
// });

var gameSchema = mongoose.Schema({
  gameName: {
    type: String,
    required: true
  },
  users: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      default: 0,
      required: true
    },
    previousPosition: {
      type: Number,
      default: 0,
      required: true
    },
    currentTarget: {
      type: String,
      default: "none",
      required: true
    },
    previousTarget: {
      type: String,
      default: "none'",
      required: true
    },
    character: {
      type: String, //Connect this somehow to characterSchema
      default: 'none',
      required: true
    },
    moveCards: [{
      moveAmount: {
        type: Number,
        required: true
      },
      cardName: {
        type: String,
        required: true
      }
    }],
    currentTurn: {
      type: Boolean,
      default: false,
      required: true
    },
    pictureSRC: {
      type: String,
      default: 'none',
      required: true
    }
  }],
  gameStatus: {
    type: String, 
    default: 'Not Started',
    required: true
  },
  currentPlayerIndex: {
    type: Number,
  },
  gamePlayerLimit: {
    type: Number,
    default: 5,
    required: true
  }
});


module.exports = {
  User: mongoose.model('User', userSchema),
  Game: mongoose.model('Game', gameSchema)
};
