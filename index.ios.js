/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

var Orientation = require('react-native-orientation');
var _ = require('underscore');

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
  View
} from 'react-native';

var middleRace = React.createClass({
  render() {
    return (
      <NavigatorIOS initialRoute={{
        component: PickAbility,
        title: 'Login',
        navigationBarHidden: true
      }}
      style={{flex: 1}}
      />
    );
  }
})

var Home = React.createClass({
  getInitialState() {
    return {
      username: null,
      password: null
    }
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: 'Register'
    })
  },
  login() {
    this.props.navigator.push({
      component: GameSelect,
      title: 'Game Select',
      navigationBarHidden: true
    })
  },
  render() {
    return(
      <View style={styles.container}>
      <View>

      <Text style={styles.welcome}>
      WELCOME EARTHLING
      </Text>
      </View>
      <View>
      <TextInput style={styles.inputField}
      placeholder='Enter your username'
      onChangeText={(text)=> this.setState({
        username: text
      })}/>
      </View>
      <View>
      <TextInput style={styles.inputField}
      placeholder='Enter your password'
      onChangeText={(text)=> this.setState({
        password: text
      })}/>

      </View>

      <View style={styles.buttonGreen}>
      <Button onPress={this.login}
      title="Login"
      color='#ffffff'/>
      </View>

      <View style={styles.buttonBlue}>
      <Button onPress={this.register}
      title="Register"
      color='#ffffff'/>
      </View>

      </View>
    )
  }
})

var GameSelect = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });



    //REAL FETCHING ROUTE FOR ALL THE GAMES

    fetch('https://middle-race.gomix.me/games', {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((json) => {
      console.log('json: ', json.games);
      this.setState({
        dataSource: ds.cloneWithRows(json.games)
      })
    })
    .catch((err) => console.log('Error: ', err))

    return ({
      dataSource: ds.cloneWithRows([])
    })
  },
  startGame(game) {
    alert('You just clicked ' + game.gameName)
  },
  testGame() {
    this.props.navigator.push({
      component: PickAbility,
      title:'Game',
      navigationBarHidden: true
    })
  },
  render() {
    return (<View style={styles.container}>

      <View>
      <Text style={styles.welcome}>
      Middle race
      </Text>
      </View>

      <View style={styles.buttonBlue}>
      <TouchableOpacity onPress={this.testGame}>

      <Text style={styles.gameTitleText}>TEST GAME NOT REAL</Text>
      </TouchableOpacity>
      </View>


      <ListView dataSource={this.state.dataSource}
      renderRow={(rowData) =>
        <TouchableOpacity onPress={this.startGame.bind(this, rowData)}>
        <View style={styles.buttonBlue}>
        <Text style={styles.gameTitleText}>{rowData.gameName}</Text>
        </View>
        </TouchableOpacity>
      }/>
      </View>)
    }
  })

  var Register = React.createClass({
    getInitialState() {
      return {
        username: null,
        password: null
      }
    },
    render() {
      return (
        <View style={styles.container}>

        <TextInput
        style={styles.inputField}
        placeholder='Enter a username'
        onChangeText={(text) => this.setState({
          username: text
        })}/>
        <TextInput
        style={styles.inputField}
        secureTextEntry={true}
        placeholder='Enter a password'
        onChangeText={(pwd) => this.setState({
          password: pwd
        })}/>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
        <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>

        </View>
      );
    }
  })

  var PickAbility = React.createClass({
    chooseWolf() {
      alert('I choose wolf abhi');
    },
    render() {
      return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor:'#0E452A'}}>

      <View style={{flex: 2, justifyContent:'center', alignItems: 'center'}}>
      <Text style={{fontSize:30, fontWeight:'bold', color: '#ffffff'}}>
      Choose your special abhility
      </Text>
      </View>


      <View style={{flex: 3, flexDirection:'row'}}>
        <View style={{flex: 1}}>
        <TouchableOpacity onPress={this.chooseWolf}>
        <Image style={styles.ability} source={require('./images/CardWolf.png')}/>
        </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
        <TouchableOpacity onPress={this.chooseBean}>
        <Image style={styles.ability}  source={require('./images/CardBean.png')}/>
        </TouchableOpacity>
        </View>


        <View style={{flex: 1}}>
        <TouchableOpacity onPress={this.chooseBolt}>
        <Image style={styles.ability}  source={require('./images/CardBolt.png')}/>
        </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
        <TouchableOpacity onPress={this.chooseSmall}>
        <Image style={styles.ability}  source={require('./images/CardSmall.png')}/>
        </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>
        <TouchableOpacity onPress={this.chooseSwag}>
        <Image style={styles.ability}  source={require('./images/CardSwag.png')}/>
        </TouchableOpacity>
        </View>
      </View>

      </View>
    )
    }
  })

  var GameScreen = React.createClass({
    render() {
      return (
        <View style={styles.gameContainer}>


        <View style={{flex: 4, backgroundColor:'#0E452A'}}>
        <Image style={{height: 200}} source={require('./images/WolfAbhi.png')}/>
        </View>

        <View style={{flex: 3, flexDirection:'row', backgroundColor:'#0E452A'}}>

        <View style={styles.cardContainer}>

          <View style={styles.card}>
          <Image style={{width: 75, height: 100}} source={require('./images/one.png')}/>
          </View>
          <View style={styles.card}>
          <Image style={{width: 75, height: 100}} source={require('./images/two.png')}/>
          </View>
          <View style={styles.card}>
          <Image style={{width: 75, height: 100}} source={require('./images/three.png')}/>
          </View>
          <View style={styles.card}>
          <Image style={{width: 75, height: 100}} source={require('./images/four.png')}/>
          </View>
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
    cardContainer: {
      flex: 8,
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor: '#0E452A',
      flexDirection: 'row'
    },
    buttonBlue: {
      backgroundColor: '#007fff',
      borderWidth: 2,
      borderColor: '#007fff',
      borderRadius: 5,
      width: 300,
      marginBottom: 5,
      marginTop: 5
    },
    buttonGreen: {
      backgroundColor: '#74d341',
      borderWidth: 2,
      borderColor: '#74d341',
      borderRadius: 5,
      width: 300,
      marginBottom: 5,
      marginTop: 5
    },
    gameContainer: {
      flex: 1,
      backgroundColor: '#0E452A'
    },
    gameTitleText: {
      color: '#ffffff',
      alignSelf: 'center'
    },
    inputField: {
      alignSelf:'center',
      width: 300,
      paddingTop: 10,
      height: 40,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      marginLeft: 5,
      marginBottom: 10,
      marginRight: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'gray'
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
    button: {
      alignSelf: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
      borderRadius: 5
    },
    buttonLabel: {
      textAlign: 'center',
      fontSize: 16,
      color: 'white'
    }
  });

  AppRegistry.registerComponent('middleRace', () => middleRace);
