var Orientation = require('react-native-orientation');
var _ = require('underscore');
var images = require('./images/imageReference');

var Login = require('./login');
var Register = require('./register');
var GameSelect = require('./gameSelect');
var GameCreate = require('./gameCreate');
var PickAbility = require('./pickAbility');
var GameScreen = require('./gameScreen');

import Modal from 'react-native-root-modal';
import {Manager as ModalManager} from 'react-native-root-modal';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  NavigatorIOS,
  Image,
  TouchableOpacity,
  Button,
  ListView,
  View,
  AsyncStorage,
  RefreshControl
} from 'react-native';

var modal

var GameScreen = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    var gameData = this.props.gameData
    var user = gameData.game.users.filter((user) => user.id === gameData.user._id)[0]
    return ({
      dataSource1: ds.cloneWithRows(gameData.game.users),
      userMoveCards: ds.cloneWithRows(user.moveCards),
      game: gameData.game,
      currentPlayerToPlay: gameData.game.users[gameData.game.currentPlayerIndex],
      user: user,
      userData: gameData.user,
      playedCard: false,
      gravity_cardSelect: 'none',
      gravity_playerSelect: 'none',
      push_screenActive: false,
      push_playersToGoForwardArray: [],
      push_screenDestroy: false,
      union_screenActive: false,
      union_playersToPullBackArray: [],
      union_screenDestroy: false
    })
  },

  componentDidMount() {
    var self = this;
    if (this.props.gameData.game.users.filter((user) => user.id === this.props.gameData.user._id)[0].character === "none") {
      setTimeout(function(){
        var PickAbility = require('./pickAbility');
          self.props.navigator.push({
            component: PickAbility,
            title: 'PickAbility',
            navigationBarHidden: true,
            passProps: {
              gameData: self.props.gameData,
              gameId: self.props.gameId
            }
          });
      }, 1000)
    } else {
      this.updateGameScreen()
      this.refillCards()
      setInterval(function(){
        self.checkForUpdate()
      }, 1000)
    }
  },

  refillCards(data) {
    var moveCardsArray
    if (data) {
      moveCardsArray = data
    } else {
      moveCardsArray = this.state.game.users.map((user) => {return user.moveCards});
    }
    var moveCardsArrayUpdate = moveCardsArray.slice(0);
    var fullMoveCardStack =   [
      {
      moveAmount: 1,
      cardName: 'One'
      },
      {
      moveAmount: 2,
      cardName: 'Two'
      },
      {
      moveAmount: 3,
      cardName: 'Three'
      },
      {
      moveAmount: 4,
      cardName: 'Four'
      }
    ];
    for (var i = 0; i < moveCardsArrayUpdate.length; i++) {
      if (moveCardsArrayUpdate[i].length === 0) {
        moveCardsArrayUpdate[i] = fullMoveCardStack.slice(0)
      }
    };

    if (moveCardsArrayUpdate.slice(0) !== moveCardsArray.slice(0)) {
      this.updateCards(moveCardsArrayUpdate);
    };
  },

  updateCards(moveCardsArray) {
    fetch('https://middle-race.gomix.me/games/updateMoveCards/' + this.props.gameId, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        moveCardsArray: moveCardsArray
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
      } else {
        this.setState({
          responseJsonError: responseJson.error,
        });
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  updateGameScreen() {
    var self = this;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    fetch('https://middle-race.gomix.me/games/' + this.props.gameId, {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((respJson) => {
      var user = respJson.game.users.filter((user) => user.id === respJson.user._id)[0]
      self.setState({
        dataSource1: ds.cloneWithRows(respJson.game.users),
        userMoveCards: ds.cloneWithRows(user.moveCards),
        game: respJson.game,
        currentPlayerToPlay: respJson.game.users[respJson.game.currentPlayerIndex],
        user: user,
        userData: respJson.user,
        playedCard: false,
        compareData: respJson,
        push_screenDestroy: true,
        union_screenDestroy: true
      })
      //Activate powers if push exists and conditions are met
      if (respJson.game.users.filter((user) => user.character === "WolfAbhi")) {
        var pushUserIndex = self.state.game.users.map((user) => user.character).indexOf("WolfAbhi")
        var indexSaver = []
        for (var i = 0; i < respJson.game.users.length; i++) {
          if (respJson.game.users[i].position === respJson.game.users[pushUserIndex].position) {
            indexSaver.push(respJson.game.users[i])
          }
        }
        console.log('WTF1')
        if (indexSaver.length > 1
            && respJson.game.users[pushUserIndex].position !== 0
            || indexSaver.length > 1
            && respJson.game.users[pushUserIndex].position === 0
            && respJson.game.users[pushUserIndex].previousPosition !== 0) {
          console.log('WTF2')

          self.setState({
            push_screenDestroy: false,
            push_screenActive: false
          }, function() {
            setTimeout(function(){
              self.push_activate(indexSaver);
            }, 200)
          })
          //Activate powers if union exists and conditions are met
        } else {
          if (respJson.game.users.filter((user) => user.character === "ClassicAbhi")) {
            var unionUserIndex = self.state.game.users.map((user) => user.character).indexOf("ClassicAbhi")
            var indexSaver = []
            for (var i = 0; i < respJson.game.users.length; i++) {
              if (respJson.game.users[i].position - 1 === respJson.game.users[unionUserIndex].position) {
                indexSaver.push(respJson.game.users[i])
              }
            }
            if (indexSaver.length > 0
                && respJson.game.users[unionUserIndex].position !== 0
                || indexSaver.length > 0
                && respJson.game.users[unionUserIndex].position === 0
                && respJson.game.users[unionUserIndex].previousPosition !== 0) {
              self.setState({
                union_screenDestroy: false,
                union_screenActive: false
              }, function() {
                setTimeout(function(){
                  self.union_activate(indexSaver);
                }, 200)
              })
            }
          }
        }
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  checkForUpdate() {
    var self = this;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    fetch('https://middle-race.gomix.me/games/' + this.props.gameId, {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((respJson) => {
      console.log('test1')
      var newPlayerPositionsArray = respJson.game.users.map((user) => {return user.position});
      var playerPositionsArray = self.state.compareData.game.users.map((user) => {return user.position});
      if (JSON.stringify(newPlayerPositionsArray) !== JSON.stringify(playerPositionsArray)) {
        console.log('test2')
        var user = respJson.game.users.filter((user) => user.id === respJson.user._id)[0]
        self.setState({
          dataSource1: ds.cloneWithRows(respJson.game.users),
          userMoveCards: ds.cloneWithRows(user.moveCards),
          game: respJson.game,
          currentPlayerToPlay: respJson.game.users[respJson.game.currentPlayerIndex],
          user: user,
          userData: respJson.user,
          playedCard: false,
          compareData: respJson,
          push_screenDestroy: true,
          union_screenDestroy: true
        }, function() {
          self.setState({
            push_screenActive: false,
          }, function() {
            self.push_activate();
          })
          //Activate powers if push exists and conditions are met
          if (respJson.game.users.filter((user) => user.character === "WolfAbhi")) {
            console.log('test3')
            var pushUserIndex = self.state.game.users.map((user) => user.character).indexOf("WolfAbhi")
            var indexSaver = []
            for (var i = 0; i < respJson.game.users.length; i++) {
              if (respJson.game.users[i].position === respJson.game.users[pushUserIndex].position) {
                indexSaver.push(respJson.game.users[i])
              }
            }
            if (indexSaver.length > 1
                && respJson.game.users[pushUserIndex].position !== 0
                || indexSaver.length > 1
                && respJson.game.users[pushUserIndex].position === 0
                && respJson.game.users[pushUserIndex].previousPosition !== 0) {
                  console.log('test4')
              self.setState({
                push_screenDestroy: false,
                push_screenActive: false
              }, function() {
                console.log('test5')
                setTimeout(function(){
                  self.push_activate(indexSaver);
                }, 200)
              })
              console.log('test5b')
              //Activate powers if union exists and conditions are met
            } else {
              console.log('test6')
              self.setState({
                union_screenActive: false,
              }, function() {
                self.union_activate();
              })
              if (respJson.game.users.filter((user) => user.character === "ClassicAbhi")) {
                console.log('test7')
                var unionUserIndex = self.state.game.users.map((user) => user.character).indexOf("ClassicAbhi")
                var indexSaver = []
                for (var i = 0; i < respJson.game.users.length; i++) {
                  if (respJson.game.users[i].position - 1 === respJson.game.users[unionUserIndex].position) {
                    indexSaver.push(respJson.game.users[i])
                  }
                }
                console.log('WTF', indexSaver)
                if (indexSaver.length > 0
                    && respJson.game.users[unionUserIndex].position !== 0
                    || indexSaver.length > 0
                    && respJson.game.users[unionUserIndex].position === 0
                    && respJson.game.users[unionUserIndex].previousPosition !== 0) {
                      console.log('test8')
                  this.setState({
                    union_screenDestroy: false,
                    union_screenActive: false
                  }, function() {
                    console.log('test9')
                    setTimeout(function(){
                      self.union_activate(indexSaver);
                    }, 200)
                  })
                  console.log('test10')
                }
              }
            }
          }
        })
      } else {
        console.log('notUpdate!')
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  updateCurrentPlayer() {
    fetch('https://middle-race.gomix.me/games/updateCurrentPlayer/' + this.props.gameId, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
      } else {
        this.setState({
          responseJsonError: responseJson.error,
        });
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  updatePlayerPositions(playerPositionsArray) {
    fetch('https://middle-race.gomix.me/games/updatePlayerPositions/' + this.props.gameId, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playerPositionsArray: playerPositionsArray
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
      } else {
        this.setState({
          responseJsonError: responseJson.error,
        });
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  chooseMoveCard(data) {
    var self = this;
    if (this.state.game.gameStatus === "Not Started") {
      alert("Game hasn't started yet!")
    } else if (this.state.game.gameStatus === "Completed") {
      alert("Game is already over!")
    } else if (this.state.currentPlayerToPlay.id !== this.state.userData._id) {
      alert("Not your turn!")
    } else if (!this.state.playedCard) {
      this.setState({
        playedCard: true
      }, function() {
        var currentUserIndex = self.state.game.users.map((user) => user.id).indexOf(self.state.userData._id)
        var moveCardsArray = self.state.game.users.map((user) => {return user.moveCards});
        var playerPositionsArray = self.state.game.users.map((user) => {return user.position});
        var index = moveCardsArray[currentUserIndex].indexOf(data)
        if (index > -1) {
          moveCardsArray = JSON.parse(JSON.stringify(moveCardsArray))
          moveCardsArray[currentUserIndex].splice(index, 1);
        }
        playerPositionsArray[currentUserIndex] += data.moveAmount
        if (moveCardsArray[currentUserIndex].length !== 0) {
          self.updateCards(moveCardsArray);
        } else {
          self.refillCards(moveCardsArray);
        }
        setTimeout(function(){
          self.updatePlayerPositions(playerPositionsArray);
        }, 200)
        self.updateCurrentPlayer();
        this.setState({
          playedCard: false
        });
      })
    } else {
      alert("slow down!")
    }
  },

  selectorStyle: function(x, y) {
    if (x === y) {
      return {
        borderColor: 'yellow',
        borderWidth: 1
      }
    }
  },

  gravity_use() {
    var self = this;
    var removeModal = () => modal.destroy();
    var modalRender = (
      <View style={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        flex: 1
        }}>
        <View style={{
          flex : 6,
          flexDirection: 'row',
        }}>
          <View style={{
            flex : 1,
            justifyContent: 'center',
          }}>
            <Text style={{color: 'white', alignSelf: 'center'}}>Choose Card to Give Up</Text>
            <View>
              <ListView
              horizontal={true}
              dataSource={this.state.userMoveCards}
              renderRow={(rowData) => {
                var image = images[rowData.cardName]
                return (
                  <View style={[styles.moveCardContainer, self.selectorStyle(rowData, this.state.gravity_cardSelect)]}>
                    <TouchableOpacity onPress={() => {self.gravity_cardSelect.bind(this, rowData)(); modalUpdate()}}>
                      <Image style={styles.moveCard} source={image}/>
                    </TouchableOpacity>
                  </View>
                  )
                }
              }/>
            </View>
          </View>
          <View style={{
            flex : 1,
            justifyContent: 'center',
          }}>
            <Text style={{color: 'white', alignSelf: 'center'}}>Choose Player to Pull</Text>
            <ListView
            dataSource={this.state.dataSource1}
            renderRow={function(rowData) {return (rowData.id !== self.state.userData._id) ? (
              <TouchableOpacity onPress={() => {self.gravity_playerSelect.bind(this, rowData.id)(); modalUpdate()}}>
                <View>
                  <Text style={[{color: 'white'}, self.selectorStyle(rowData.id, self.state.gravity_playerSelect)]}>Current Position:{rowData.position} Current Turn:{JSON.stringify(self.state.game.users[self.state.game.currentPlayerIndex] === rowData)} {rowData.name} {rowData.character} </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            }/>
          </View>
        </View>
        <View style={{
          flex : 1,
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
          <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={removeModal}>
            <Text style={styles.buttonLabel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={() => {removeModal(); self.gravity_confirm();}}>
            <Text style={styles.buttonLabel}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
    var modalUpdate = function() {
      setTimeout(function(){
        modal.destroy()
        modal = new ModalManager(
          modalRender
        )
      }, 100)
    }
    if (this.state.game.gameStatus === "Not Started") {
      alert("Game hasn't started yet!")
    } else if (this.state.game.gameStatus === "Completed") {
      alert("Game is already over!")
    } else if (this.state.currentPlayerToPlay.id !== this.state.userData._id) {
      alert("Not your turn!")
    } else {
      var modal = new ModalManager(
        modalRender
      );
    }
  },

  gravity_playerSelect(data) {
    this.setState({
      gravity_playerSelect: data
    });
  },

  gravity_cardSelect(data) {
    this.setState({
      gravity_cardSelect: data
    });
  },

  gravity_confirm() {
    var self = this;
    var currentUserIndex = self.state.game.users.map((user) => user.id).indexOf(self.state.userData._id)
    var targetUserIndex = self.state.game.users.map((user) => user.id).indexOf(this.state.gravity_playerSelect)
    var moveCardsArray = self.state.game.users.map((user) => {return user.moveCards});
    var playerPositionsArray = self.state.game.users.map((user) => {return user.position});
    var index = moveCardsArray[currentUserIndex].indexOf(this.state.gravity_cardSelect)
    if (this.state.gravity_playerSelect === "none" || this.state.gravity_cardSelect === "none") {
      alert("You must select a card to give up and a target")
    } else if (self.state.game.users.filter((user) => user.id === self.state.userData._id)[0].currentTarget === this.state.gravity_playerSelect) {
      alert("Your previous target was this character. Choose another character to target.")
    } else if (playerPositionsArray[currentUserIndex] === playerPositionsArray[targetUserIndex]
               || playerPositionsArray[currentUserIndex] + 1 === playerPositionsArray[targetUserIndex]
               || playerPositionsArray[currentUserIndex] -1 === playerPositionsArray[targetUserIndex]) {
      alert('You must pull a player further away from you!')
    } else {
      if (index > -1) {
        moveCardsArray = JSON.parse(JSON.stringify(moveCardsArray))
        moveCardsArray[currentUserIndex].splice(index, 1);
      }
      if (playerPositionsArray[currentUserIndex] > playerPositionsArray[targetUserIndex]) {
        playerPositionsArray[targetUserIndex] = playerPositionsArray[currentUserIndex] - 1
      } else {
        playerPositionsArray[targetUserIndex] = playerPositionsArray[currentUserIndex] + 1
      }
      if (moveCardsArray[currentUserIndex].length !== 0) {
        self.updateCards(moveCardsArray);
      } else {
        console.log('wy')
        self.refillCards(moveCardsArray);
      }
      setTimeout(function(){
        self.updatePlayerPositions(playerPositionsArray);
      }, 200)
      self.updateCurrentPlayer();
    }
  },

  push_selectorStyle: function(x, y) {
    if (y.indexOf(x) !== -1) {
      return {
        borderColor: 'yellow',
        borderWidth: 1
      }
    }
  },

  push_playerSelectToggle(data) {
    var push_playerArray = JSON.parse(JSON.stringify(this.state.push_playersToGoForwardArray))
    var index = push_playerArray.indexOf(data)
    if (index < 0) {
      push_playerArray.push(data)
    } else {
      push_playerArray.splice(index, 1)
    }
    this.setState({
      push_playersToGoForwardArray: push_playerArray
    });
  },

  push_activate(data) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    var removeModal = () => {modal.destroy(); console.log('ultimate destruction')}
    var self = this;
    if (this.state.push_screenActive === false) {
      this.setState({
        push_screenActive: true
      })
      var self = this;
      ((this.state.user.character === 'WolfAbhi') ? (
      modalRender = (
        <View style={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          flex: 1
          }}>
          <View style={{
            flex : 6,
            flexDirection: 'row',
          }}>
            <View style={{
              flex : 1,
              justifyContent: 'center',
            }}>
              <Text style={{color: 'white', alignSelf: 'center'}}>Choose Players to push ahead of you. The rest will be pushed back</Text>
              <ListView
              dataSource={ds.cloneWithRows(data)}
              renderRow={function(rowData) {return (rowData.id !== self.state.userData._id) ? (
                <TouchableOpacity onPress={() => {self.push_playerSelectToggle.bind(this, rowData.id)(); modalUpdate()}}>
                  <View>
                    <Text style={[{color: 'white'}, self.push_selectorStyle(rowData.id, self.state.push_playersToGoForwardArray)]}>Current Position:{rowData.position} Current Turn:{JSON.stringify(self.state.game.users[self.state.game.currentPlayerIndex] === rowData)} {rowData.name} {rowData.character} </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              }/>
            </View>
          </View>
          <View style={{
            flex : 1,
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
            <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={() => {removeModal(); self.push_confirm(data);}}>
              <Text style={styles.buttonLabel}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : (
        modalRender = (
          <View style={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
            }}>
            <Text style={{color: 'white', alignSelf: 'center'}}>WolfAhbi is deciding which direction to chase the people near him away from his territory.</Text>
          </View>
        )
      ))
      var modalUpdate = function() {
        setTimeout(function(){
          modal.destroy()
          modal = new ModalManager(
            modalRender
          )
        }, 100)
      }
      if (this.state.game.gameStatus === "Not Started") {
        alert("Game hasn't started yet!")
      } else if (this.state.game.gameStatus === "Completed") {
        alert("Game is already over!")
      } else if (this.state.push_screenDestroy !== true) {
        modal = new ModalManager(
          modalRender
        );
      }
      if (this.state.push_screenDestroy === true) {
        removeModal()
        this.setState({
          push_screenDestroy: false
        })
      }
    }
  },

  push_confirm(data) {
    var self = this;
    var arrayToCompare = data.filter((user) => user.id !== this.state.userData._id).map((user) => user.id);
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    var playersPushForwardIndexArray = this.state.push_playersToGoForwardArray.map((id) => this.state.game.users.map((user) => user.id).indexOf(id))
    var playersPushBackwardIndexArray = arrayToCompare.diff(this.state.push_playersToGoForwardArray).map((id) => this.state.game.users.map((user) => user.id).indexOf(id))
    var playerPositionsArray = this.state.game.users.map((user) => {return user.position});

    for (var i = 0; i < playersPushBackwardIndexArray.length; i++) {
      playerPositionsArray[playersPushBackwardIndexArray[i]]--
    }
    for (var i = 0; i < playersPushForwardIndexArray.length; i++) {
      playerPositionsArray[playersPushForwardIndexArray[i]]++
    }
    setTimeout(function(){
      self.updatePlayerPositions(playerPositionsArray);
    }, 200)
    console.log('called')
  },

  union_selectorStyle: function(x, y) {
    if (y.indexOf(x) !== -1) {
      return {
        borderColor: 'yellow',
        borderWidth: 1
      }
    }
  },

  union_playerSelectToggle(data) {
    var union_playerArray = JSON.parse(JSON.stringify(this.state.union_playersToPullBackArray))
    var index = union_playerArray.indexOf(data)
    if (index < 0) {
      union_playerArray.push(data)
    } else {
      union_playerArray.splice(index, 1)
    }
    this.setState({
      union_playersToPullBackArray: union_playerArray
    });
  },

  union_activate(data) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    var removeModal = () => {modal.destroy(); console.log('ultimate destruction')}
    var self = this;
    if (this.state.union_screenActive === false) {
      this.setState({
        union_screenActive: true
      })
      var self = this;
      ((this.state.user.character === 'ClassicAbhi') ? (
      modalRender = (
        <View style={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          flex: 1
          }}>
          <View style={{
            flex : 6,
            flexDirection: 'row',
          }}>
            <View style={{
              flex : 1,
              justifyContent: 'center',
            }}>
              <Text style={{color: 'white', alignSelf: 'center'}}>Choose Players to pull to your location. Players not chosen will not move.</Text>
              <ListView
              dataSource={ds.cloneWithRows(data)}
              renderRow={function(rowData) {return (rowData.id !== self.state.userData._id) ? (
                <TouchableOpacity onPress={() => {self.union_playerSelectToggle.bind(this, rowData.id)(); modalUpdate()}}>
                  <View>
                    <Text style={[{color: 'white'}, self.union_selectorStyle(rowData.id, self.state.union_playersToPullBackArray)]}>Current Position:{rowData.position} Current Turn:{JSON.stringify(self.state.game.users[self.state.game.currentPlayerIndex] === rowData)} {rowData.name} {rowData.character} </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              }/>
            </View>
          </View>
          <View style={{
            flex : 1,
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}>
            <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={() => {removeModal(); self.union_confirm(data);}}>
              <Text style={styles.buttonLabel}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : (
        modalRender = (
          <View style={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
            }}>
            <Text style={{color: 'white', alignSelf: 'center'}}>ClassicAbhi is deciding who he wants to bring directly to him.</Text>
          </View>
        )
      ))
      var modalUpdate = function() {
        setTimeout(function(){
          modal.destroy()
          modal = new ModalManager(
            modalRender
          )
        }, 100)
      }
      if (this.state.game.gameStatus === "Not Started") {
        alert("Game hasn't started yet!")
      } else if (this.state.game.gameStatus === "Completed") {
        alert("Game is already over!")
      } else if (this.state.union_screenDestroy !== true) {
        modal = new ModalManager(
          modalRender
        );
      }
      if (this.state.union_screenDestroy === true) {
        removeModal()
        this.setState({
          union_screenDestroy: false
        })
      }
    }
  },

  union_confirm(data) {
    var self = this;

    var playersPullIndexArray = this.state.union_playersToPullBackArray.map((id) => this.state.game.users.map((user) => user.id).indexOf(id))
    var playerPositionsArray = this.state.game.users.map((user) => {return user.position});

    for (var i = 0; i < playersPullIndexArray .length; i++) {
      playerPositionsArray[playersPullIndexArray[i]]--
    }
    setTimeout(function(){
      self.updatePlayerPositions(playerPositionsArray);
    }, 200)
    console.log('called')
  },


  createPieceStyle(width, margin, top) {
    var dim = parseInt(width)
    var style = StyleSheet.create({
      piece: {
        alignSelf: 'flex-start',
        width: width,
        height: (width * 1.33),
        backgroundColor: 'yellow',
        marginLeft: margin - 7,
        marginTop: top
      }
    })

    return (
      style.piece
    )
  },

  render() {
    var self = this;
    var person
    return (
      <View style={styles.gameContainer}>
        <View style={{flex: 1, backgroundColor: '#0E452A'}}>
          <Text style={{color: 'white'}}>
            CurrentPlayer: {this.state.currentPlayerToPlay.name}
          </Text>
        </View>
        <View style={{flex: 6, backgroundColor:'#0E452A'}}>
          <Image style={{height: 175, alignSelf:'center', width: 600}}
          source={{url: 'https://cdn.gomix.com/2e14262c-711a-4711-8a5d-d8110aa0d48a%2Fboard2.png'}}>
            <ListView
            dataSource={this.state.dataSource1}
            renderRow={function(rowData) {
              var image = images[rowData.pictureSrc];
              var currentUserIndex = self.state.game.users.map((user) => user.id).indexOf(self.state.userData._id);
              var num = self.state.dataSource1.rowIdentities.length;
              return (
              <TouchableOpacity>
                <View>
                  <Image style={self.createPieceStyle(25, (rowData.position*19), (175 / num * 0))}
                  source={image}></Image>
                </View>
              </TouchableOpacity>)
              }
            }/>
          </Image>
        </View>
        <View style={{flex: 4, flexDirection:'row', backgroundColor:'#0E452A'}}>
          <View style={styles.cardContainer}>
            <ListView
            horizontal={true}
            dataSource={this.state.userMoveCards}
            renderRow={(rowData) => {
              var image = images[rowData.cardName]
              return (
                <View style={styles.moveCardContainer}>
                  <TouchableOpacity onPress={self.chooseMoveCard.bind(this, rowData)}>
                    <Image style={styles.moveCard} source={image}/>
                  </TouchableOpacity>
                </View>
                )
              }
            }/>
          </View>

          <View style={{flex: 5, flexDirection:'row'}}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            {(this.state.user.character === 'SwagAbhi') ? (
              <TouchableOpacity style={[styles.button, styles.buttonAbility]} onPress={self.gravity_use}>
                <Text style={styles.buttonLabelAbility}>Use Gravity</Text>
              </TouchableOpacity>
              ) : null}
            </View>
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Image style={{height: 133, width: 100}} source={images[self.state.user.pictureSrc]}/>
          </View>
          </View>

        </View>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  gamesContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#0E452A'
  },
  gameTitleText: {
    color: '#ffffff',
    alignSelf: 'center'
  },
  userList: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  userListInner: {
    paddingTop: 10,
    paddingBottom: 10,
    color: 'grey'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  buttonStretch: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#d3d3d3',
  },
  buttonAbility: {
    alignSelf:'stretch',
    width: 100,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 2
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  buttonLabelAbility: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  buttoninput: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 0,
    paddingLeft: 10,
    paddingRight: 10
  },
  buttonCorner: {
    width: 100
  },
  buttonCenter: {
    width: 300
  },
  card: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ability: {
    width: 100,
    height: 133,
    alignSelf:'center'
  },
  abilityContainer: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  moveCard: {
    width: 75,
    height: 100
  },
  moveCardContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10
  },
  cardContainer: {
    flex: 8,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#0E452A',
    flexDirection: 'row'
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gamesViewGameDisplay: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 0,
    paddingLeft: 10,
    paddingRight: 10
  }
});

module.exports = GameScreen
