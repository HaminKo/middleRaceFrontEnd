var Orientation = require('react-native-orientation');
var _ = require('underscore');
var images = require('./images/imageReference')

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

var MiddleRace = React.createClass({
  render() {
    return (
      <NavigatorIOS
      initialRoute={{
        component: Login,
        title: 'Login',
        navigationBarHidden: true
      }}
      style={{flex: 1}}
      />
    );
  }
})

var Login = React.createClass({
  getInitialState() {
    return {
      responseJsonError: '',
      loginmessage: ''
    }
  },
  login(username, password) {
    fetch('https://middle-race.gomix.me/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success === true) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: username,
          password: password
        }));
        this.props.navigator.push({
          component: GameSelect,
          title: "Users",
          navigationBarHidden: true
        })
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
  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.setState({
          loginmessage: ('Logged in as ' + username + '.')
        })
        return this.login(username, password)
      }
    })
    .catch(err => {console.log('error', err)})
  },
  press() {
    this.login(this.state.username, this.state.password)
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register",
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Middle Race!</Text>
        <Text style={styles.textBig}>
        {this.state.responseJsonError}
        </Text>
        <Text>
        {this.state.loginmessage}
        </Text>
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
          />
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
          />
        <TouchableOpacity style={[styles.buttoninput, styles.buttonRed]} onPress={this.press}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonStretch, styles.buttonBlue]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Register = React.createClass({
  getInitialState() {
    return {
      responseJsonError: ''
    }
  },
  register() {
    fetch('https://middle-race.gomix.me/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success === true) {
        this.props.navigator.pop()
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>
        {this.state.responseJsonError}
        </Text>
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
          />
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
          />
        <TouchableOpacity style={[styles.buttoninput, styles.buttonRed]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});


var GameSelect = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ({
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    })
  },

  componentDidMount() {
    this._onRefresh();
  },

  _onRefresh(test) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({refreshing: true});
    fetch('https://middle-race.gomix.me/games', {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((json) => {
      this.setState({
        dataSource: ds.cloneWithRows(json.games),
        refreshing: false
      })
    })
    .catch((err) => console.log('Error: ', err))
  },

  logout() {
    fetch('https://middle-race.gomix.me/logout', {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((respJson) => {
      if (respJson.success === true) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: null,
          password: null
        }));
        this.props.navigator.pop()
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  rules() {
    this.props.navigator.push({
      component: Rules,
      title:'Game Rules',
    })
  },

  joinGame(game) {
    fetch('https://middle-race.gomix.me/games/join/' + game._id, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      if (responseJson.success === true) {
        this.enterGame(game)
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  enterGame(game) {
    fetch('https://middle-race.gomix.me/games/' + game._id, {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((respJson) => {
      if (respJson.game.users.filter((user) => user.id === respJson.user._id).length > 0) {
        this.props.navigator.push({
          component: GameScreen,
          title:'The Game, lol',
          navigationBarHidden: true,
          passProps: {
            gameData: respJson,
            gameId: game._id
          }
        })
      } else if (respJson.game.users.length < respJson.game.gamePlayerLimit) {
        this.joinGame(game)
      } else {
        alert('Game is full!')
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  createGame(game) {
    this.props.navigator.push({
      component: GameCreate,
      title:'Create New Game',
    })
  },

  testGame() {
    this.props.navigator.push({
      component: PickAbility,
      title:'Game',
      navigationBarHidden: true
    })
  },

  render() {
    return (
      <View style={styles.gamesContainer}>
        <View style={styles.topView}>
          <TouchableOpacity style={[styles.buttonBlue, styles.button, styles.buttonCorner]} onPress={this.logout}>
            <Text style={styles.buttonLabel}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonBlue, styles.button, styles.buttonCenter]} onPress={this.createGame}>
            <Text style={styles.buttonLabel}>Create New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonBlue, styles.button, styles.buttonCorner]} onPress={this.rules}>
            <Text style={styles.buttonLabel}>Rules</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.welcome}>
            Middle race
          </Text>
        </View>

        <ListView
        refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          />
        }
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <TouchableOpacity onPress={this.enterGame.bind(this, rowData)}>
            <View style={[styles.gamesViewGameDisplay, styles.buttonRed, {flexDirection: 'row'}]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text >{rowData.gameName}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text >{rowData.gameStatus} {rowData.users.length}/{rowData.gamePlayerLimit}</Text>
              </View>
            </View>
          </TouchableOpacity>
        }/>
      </View>
    )
  }
})


var GameCreate = React.createClass({
  getInitialState() {
    return ({
      gameName: ''
    })
  },
  createGame() {
    fetch('https://middle-race.gomix.me/games/create', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameName: this.state.gameName
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success === true) {
        this.props.navigator.pop()
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

  render() {
    return (
      <View style={[styles.gamesContainer, {paddingTop: 30}]}>

        <View>
          <Text style={styles.welcome}>
            Create New Game
          </Text>
        </View>

        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Game Name"
          onChangeText={(text) => this.setState({gameName: text})}
          />
        <TouchableOpacity style={[styles.buttoninput, styles.buttonRed]} onPress={this.createGame}>
          <Text style={styles.buttonLabel}>Create New Game</Text>
        </TouchableOpacity>

      </View>
    )
  }

})

var PickAbility = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    fetch('https://middle-race.gomix.me/characters', {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((json) => {
      console.log('json: ', json.characters);
      this.setState({
        dataSource: ds.cloneWithRows(json.characters)
      })
    })
    .catch((err) => console.log('Error: ', err))
    return ({
      dataSource: ds.cloneWithRows([]),
    })
  },
  chooseAbility(data) {
    var self = this;
    var removeModal = () => modal.destroy();
    var modal = new ModalManager(
      <View style={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex: 1
        }}>
        <View style={{
          flex : 6,
          flexDirection: 'row',
        }}>
          <View style={{
            flex : 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image style={{width: 200, height: 266}} source={images[data.picture]}/>
          </View>
          <View style={{
            flex : 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{color: 'white'}}>{data.characterDescription}</Text>
            <Text style={{color: 'white'}}></Text>
            <Text style={{color: 'white'}}>{data.abilityDescription}</Text>
          </View>
        </View>
        <View style={{
          flex : 1,
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
          <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={removeModal}>
            <Text style={styles.buttonLabel}>NOPE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonRed, {width: 200}]} onPress={() => {removeModal(); self.confirmAbility.bind(this, data.characterName)();}}>
            <Text style={styles.buttonLabel}>YUP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    console.log('test', data);
  },

  confirmAbility(character) {
    fetch('https://middle-race.gomix.me/games/chooseCharacter/' + this.props.gameId, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        character: character
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success === true) {
        //TEMPORARY SOLUTION, CHANGE TO .pop LATER
        var newObject = JSON.parse(JSON.stringify(this.props.gameData));
        newObject.game.users.forEach((user) => {
          if (user.id === newObject.user._id) {
            user.character = character
          }
        })
        this.props.navigator.push({
          component: GameScreen,
          title:'The Game, lol',
          navigationBarHidden: true,
          passProps: {
            gameData: newObject,
            gameId: this.props.gameId,
          }
        })
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

  render() {
    var self = this;
    // fix objects below
    return (
      <View style={{flex: 1, flexDirection:'column', backgroundColor:'#0E452A'}}>
        <View style={{flex: 2, justifyContent:'center', alignItems: 'center'}}>
          <Text style={{fontSize:30, fontWeight:'bold', color: '#ffffff'}}>
          Choose your special abhility
          </Text>
          <Text style={{fontSize:15, fontWeight:'bold', color: '#ffffff'}}>
          Characters move orders are from left to right. I.e, the left character goes first. -- BALANCED ORDERING NOT IMPLEMENTED YET
          </Text>
        </View>
        <View style={{flex: 3, flexDirection:'row'}}>
          <ListView
          horizontal={true}
          dataSource={this.state.dataSource}
          renderRow={function(rowData) {
            if (rowData.picture === 'A') {
              return (
                <View style={styles.abilityContainer}>
                  <TouchableOpacity onPress={self.chooseAbility.bind(this, rowData)}>
                    <View style={[styles.ability, {backgroundColor: 'blue'}]}>
                      <Text>With</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            } else if (rowData.picture === 'B') {
              return (
                <View style={styles.abilityContainer}>
                  <TouchableOpacity onPress={self.chooseAbility.bind(this, rowData)}>
                    <View style={[styles.ability, {backgroundColor: 'red'}]}>
                      <Text>Jump</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            } else if (rowData.picture === 'C') {
              return (
                <View style={styles.abilityContainer}>
                  <TouchableOpacity onPress={self.chooseAbility.bind(this, rowData)}>
                    <View style={[styles.ability, {backgroundColor: 'green'}]}>
                      <Text>Reset</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            } else {
              var image = images[rowData.picture]
              return (
                <View style={styles.abilityContainer}>
                  <TouchableOpacity onPress={self.chooseAbility.bind(this, rowData)}>
                    <Image style={styles.ability} source={image}/>
                  </TouchableOpacity>
                </View>
              )
            }
          }}/>
        </View>
      </View>
    )
  }
})

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
    })
  },

  componentDidMount() {
    if (this.props.gameData.game.users.filter((user) => user.id === this.props.gameData.user._id)[0].character === "none") {
      var self = this;
      setTimeout(function(){
          self.props.navigator.push({
            component: PickAbility,
            title:'Game',
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
    }
  },

  refillCards() {
    var moveCardsArray = this.state.game.users.map((user) => {return user.moveCards});
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
    if (this.state.currentPlayerToPlay.id !== this.state.userData._id) {
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
          moveCardsArray[currentUserIndex].splice(index, 1);
        }
        console.log(playerPositionsArray)
        playerPositionsArray[currentUserIndex] += data.moveAmount
        console.log(playerPositionsArray)
        if (moveCardsArray[currentUserIndex].length !== 0) {
          self.updateCards(moveCardsArray);
        } else {
          self.refillCards()
        }
        self.updatePlayerPositions(playerPositionsArray)
        self.updateCurrentPlayer()
        console.log('called')
      })
    } else {
      alert("slow down!")
    }
  },

  render() {
    var self = this;
    return (
      <View style={styles.gameContainer}>
        <View style={{flex: 4, backgroundColor:'#0E452A'}}>
        <Text style={{color: 'white'}}>
          CurrentPlayer: {this.state.currentPlayerToPlay.name}
        </Text>
          <ListView
          dataSource={this.state.dataSource1}
          renderRow={(rowData) =>
            <TouchableOpacity>
              <View>
                <Text style={{color: 'white'}}>Current Position:{rowData.position} Current Turn:{JSON.stringify(this.state.game.users[this.state.game.currentPlayerIndex] === rowData)} {rowData.name} {rowData.character} </Text>
              </View>
            </TouchableOpacity>
          }/>
        </View>

        <View style={{flex: 3, flexDirection:'row', backgroundColor:'#0E452A'}}>

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

          <View style={{flex: 5, backgroundColor:'#0E452A'}}>
            <Image source={require('./images/BeanAbhi.png')}/>
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
    backgroundColor: '#FF585B',
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
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
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
  // topButtonLeft: {
  //   display: 'inline-block',
  //   alignSelf: 'left'
  // },
  // topButtonLeft: {
  //   display: 'inline-block',
  //   alignSelf: 'right'
  // }
});

AppRegistry.registerComponent('middleRace', () => middleRace);
