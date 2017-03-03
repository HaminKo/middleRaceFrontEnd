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

var characterSchema = mongoose.Schema({
  characterName: {
    type: String,
    required: true
  },
  powerType: {
    type: String,
    required: true,
    enum: [
      'Active',
      'Passive'
    ]
  },
  description: {
    type: String,
    required: true
  },
  power: {
    type: Function,
    required: true
  }
});

var gameSchema = mongoose.Schema({
  users: [{
    name: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    power: {
      type: String, //Connect this somehow to characterSchema
      required: true
    },
    moveCards: [{
      name: {
        type: String,
        required: true
      },
      spaces: {
        type: Number,
        required: true
      }
    }]
  }],
  gameStatus: {
    type: String, 
    default: 'Not Started',
    required: true
  },
})

module.exports = {
  User: mongoose.model('User', userSchema),
  Character: mongoose.model('Character', characterSchema),
  Game: mongoose.model('Game', gameSchema)
};
