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
            alignItems: 'center'
          }}>
            <Image style={{width: 200, height: 266}} source={images[data.picture]}/>
          </View>
          <View style={{
            flex : 1,
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 20
          }}>
            <Text style={{color: 'white'}}>{data.characterDescription}</Text>
            <Text style={{color: 'white'}}></Text>
            <Text style={{color: 'white', alignSelf: 'center'}}>Ability: {data.ability}</Text>
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
                  <Text style={{color: '#ffffff'}}>Ability: {rowData.ability}</Text>
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
                  <Text style={{color: '#ffffff'}}>Ability: {rowData.ability}</Text>
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
                  <Text style={{color: '#ffffff'}}>Ability: {rowData.ability}</Text>
                </View>
              )
            } else {
              var image = images[rowData.picture]
              return (
                <View style={styles.abilityContainer}>
                  <TouchableOpacity onPress={self.chooseAbility.bind(this, rowData)}>
                    <Image style={styles.ability} source={image}/>
                  </TouchableOpacity>
                  <Text style={{color: '#ffffff'}}>Ability: {rowData.ability}</Text>
                </View>
              )
            }
          }}/>
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
    paddingRight: 10,
    alignItems: 'center',
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
});

module.exports = PickAbility
