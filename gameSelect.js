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
    fetch('https://middle-race.glitch.me/games', {
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
    fetch('https://middle-race.glitch.me/logout', {
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
    fetch('https://middle-race.glitch.me/games/join/' + game._id, {
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
    fetch('https://middle-race.glitch.me/games/' + game._id, {
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
  gameTitleText: {
    color: '#ffffff',
    alignSelf: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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

module.exports = GameSelect
