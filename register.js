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

var Register = React.createClass({
  getInitialState() {
    return {
      responseJsonError: ''
    }
  },
  register() {
    fetch('https://middle-race.glitch.me/register', {
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
});

module.exports = Register
