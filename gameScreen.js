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
      gravityCardSelect: 'none',
      gravityPlayerSelect: 'none'
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
      this.refillCards()
      setInterval(function(){
        self.updateGameScreen()
        console.log('update')
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
        this.updateGameScreen();
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
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    fetch('https://middle-race.gomix.me/games/' + this.props.gameId, {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((respJson) => {
      var user = respJson.game.users.filter((user) => user.id === respJson.user._id)[0]
      this.setState({
        dataSource1: ds.cloneWithRows(respJson.game.users),
        userMoveCards: ds.cloneWithRows(user.moveCards),
        game: respJson.game,
        currentPlayerToPlay: respJson.game.users[respJson.game.currentPlayerIndex],
        user: user,
        userData: respJson.user,
        playedCard: false
      })
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
        this.updateGameScreen()
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
        this.updateGameScreen()
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
          self.refillCards(moveCardsArray)
        }
        self.updatePlayerPositions(playerPositionsArray)
        self.updateCurrentPlayer()
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

  useGravity() {
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
                  <View style={[styles.moveCardContainer, self.selectorStyle(rowData, this.state.gravityCardSelect)]}>
                    <TouchableOpacity onPress={() => {self.gravityCardSelect.bind(this, rowData)(); modalUpdate()}}>
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
              <TouchableOpacity onPress={() => {self.gravityPlayerSelect.bind(this, rowData.id)(); modalUpdate()}}>
                <View>
                  <Text style={[{color: 'white'}, self.selectorStyle(rowData.id, self.state.gravityPlayerSelect)]}>Current Position:{rowData.position} Current Turn:{JSON.stringify(self.state.game.users[self.state.game.currentPlayerIndex] === rowData)} {rowData.name} {rowData.character} </Text>
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
          <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={() => {removeModal(); self.confirmGravity();}}>
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

  gravityPlayerSelect(data) {
    console.log(data)
    this.setState({
      gravityPlayerSelect: data
    });
  },

  gravityCardSelect(data) {
    console.log(data)
    this.setState({
      gravityCardSelect: data
    });
  },

  confirmGravity(data) {
    var self = this;
    if (this.state.gravityPlayerSelect === "none" || this.state.gravityCardSelect === "none") {
      alert("You must select a card to give up and a target")
    } else if (self.state.game.users.filter((user) => user.id === self.state.userData._id)[0].currentTarget === this.state.gravityPlayerSelect) {
      alert("Your previous target was this character. Choose another character to target.")
    } else {
      console.log(this.state.gravityPlayerSelect)
      console.log(this.state.gravityCardSelect)

      var currentUserIndex = self.state.game.users.map((user) => user.id).indexOf(self.state.userData._id)
      var targetUserIndex = self.state.game.users.map((user) => user.id).indexOf(this.state.gravityPlayerSelect)
      var moveCardsArray = self.state.game.users.map((user) => {return user.moveCards});
      var playerPositionsArray = self.state.game.users.map((user) => {return user.position});
      var index = moveCardsArray[currentUserIndex].indexOf(this.state.gravityCardSelect)
      console.log(moveCardsArray)
      if (index > -1) {
        moveCardsArray = JSON.parse(JSON.stringify(moveCardsArray))
        moveCardsArray[currentUserIndex].splice(index, 1);
      }
      console.log('WTF', moveCardsArray)
      console.log(playerPositionsArray)
      //MOVE THIS ABOVE THE INDEX SPLICE LATER
      if (playerPositionsArray[currentUserIndex] === playerPositionsArray[targetUserIndex] || playerPositionsArray[currentUserIndex] + 1 === playerPositionsArray[targetUserIndex] || playerPositionsArray[currentUserIndex] -1 === playerPositionsArray[targetUserIndex]) {
        alert('cannot pull this user')
      } else if (playerPositionsArray[currentUserIndex] > playerPositionsArray[targetUserIndex]) {
        playerPositionsArray[targetUserIndex] = playerPositionsArray[currentUserIndex] - 1
      } else {
        playerPositionsArray[targetUserIndex] = playerPositionsArray[currentUserIndex] + 1
      }
      console.log(playerPositionsArray)
      // if (moveCardsArray[currentUserIndex].length !== 0) {
      //   self.updateCards(moveCardsArray);
      // } else {
      //   self.refillCards()
      // }
      // self.updatePlayerPositions(playerPositionsArray)
      // self.updateCurrentPlayer()
      console.log('called')
    }
  },

  push_activate(data) {
    if (this.state.push_screenActive === false) {
      this.setState({
        push_screenActive: true
      })
      var self = this;
      var removeModal = () => modal.destroy();
      var modalRender;
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
              dataSource={data}
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
            <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={() => {removeModal(); self.gravity_confirm();}}>
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
            alignContet: 'center'
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
      } else if (this.state.currentPlayerToPlay.id !== this.state.userData._id) {
        alert("Not your turn!")
      } else {
        var modal = new ModalManager(
          modalRender
        );
      }
    }
  },

  push_confirm() {

  },

  createPieceStyle(width, margin) {
    var dim = parseInt(width)
    var style = StyleSheet.create({
      piece: {
        alignSelf: 'flex-start',
        width: width,
        height: (width * 1.33),
        backgroundColor: 'yellow',
        marginLeft: margin + 3
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
            var image = images[rowData.picture];
            var num = self.state.dataSource1.rowIdentities.length;
            console.log('num: ', num)
            return (
            <TouchableOpacity>
              <View>
              <Image style={self.createPieceStyle(5, (rowData.position*19))}
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

          <View style={{flex: 5, backgroundColor:'pink', flexDirection:'row'}}>

            <View style={{flex:1, backgroundColor:'yellow'}}>
            {(this.state.user.character === 'SwagAbhi') ? (
              <TouchableOpacity style={[styles.button, styles.buttonAbility, {width: 200}]} onPress={self.useGravity}>
                <Text style={styles.buttonLabelAbility}>Use Gravity</Text>
              </TouchableOpacity>
              ) : null
            }</View>

          <View style={{flex:1, backgroundColor:'red'}}>
          {console.log('src: ', )}
            <Image style={{height: 133, width: 100}} source={self.state.user.pictureSrc}/>

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
