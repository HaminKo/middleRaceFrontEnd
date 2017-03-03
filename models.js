var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
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
    character: {
      type: String, //Connect this somehow to characterSchema
      default: 'none',
      required: true,
      enum: [
        'none',
        'AbhiPull',
        'AhbiPunch',
        'AhbiUPSA',
        'AhbiSmall',
        'WolfAhbi'
      ]
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Character'
    },
    moveCards: [{
      moveAmount: {
        type: Number,
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
      default: null,
      required: true
    }
  }],
  gameStatus: {
    type: String, 
    default: 'Not Started',
    required: true
  },
  curentPlayer: {
    type: Number,
  },
  gamePlayerLimit: {
    type: Number,
    default: 3,
    required: true
  }
});


module.exports = {
  User: mongoose.model('User', userSchema),
  Game: mongoose.model('Game', gameSchema)
};
