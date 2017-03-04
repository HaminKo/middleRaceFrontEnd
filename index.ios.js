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
  View,
  AsyncStorage,
  RefreshControl
} from 'react-native';

var middleRace = React.createClass({

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
      console.log('responsejosn', responseJson)
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
      navigationBarHidden: true
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
      console.log('responsejosn', responseJson)
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
    //REAL FETCHING ROUTE FOR ALL THE GAMES
    // fetch('https://middle-race.gomix.me/games', {
    //   method: 'GET',
    // })
    // .then((resp) => resp.json())
    // .then((json) => {
    //   console.log('json: ', json.games);
    //   this.setState({
    //     dataSource: ds.cloneWithRows(json.games)
    //   })
    // })
    // .catch((err) => console.log('Error: ', err))

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
      console.log('json: ', json.games);
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
      console.log('json: ', respJson);
      if (respJson.success === true) {
        console.log('logged out')
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

  joinGame(game_id) {
    fetch('https://middle-race.gomix.me/games/join/' + game_id, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('responsejson', responseJson)
      if (responseJson.success === true) {
        console.log('joined game!')
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
      console.log('json: ', respJson);
      if (respJson.game.users.filter((user) => user.id === respJson.user._id).length > 0) {
        this.props.navigator.push({
          component: GameScreen,
          title:'The Game, lol',
          navigationBarHidden: true,
          passProps: {
            game: respJson
          }
        })
      } else if (respJson.game.users.length < respJson.game.gamePlayerLimit) {
        console.log('also true')
        this.joinGame(game._id)
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
      navigationBarHidden: true
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

        <View style={styles.buttonBlue}>
          <TouchableOpacity onPress={this.testGame}>
            <Text style={styles.gameTitleText}>TEST GAME NOT REAL</Text>
            </TouchableOpacity>
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
      console.log('responsejson', responseJson)
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
  const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
  });
  return ({
    dataSource: ds.cloneWithRows([]),
    refreshing: false
  });
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
      <Text style={{fontSize:30, fontWeight:'bold', color: '#ffffff'}}>
      Choose your special abhility
      </Text>
    </View>


    <View style={{flex: 3, flexDirection:'row'}}>
      // <View style={{flex: 1}}>
      // <TouchableOpacity onPress={this.chooseWolf}>
      // <Image style={styles.ability} source={require('./images/CardWolf.png')}/>
      // </TouchableOpacity>
      // </View>
      //
      // <View style={{flex: 1}}>
      // <TouchableOpacity onPress={this.chooseBean}>
      // <Image style={styles.ability}  source={require('./images/CardBean.png')}/>
      // </TouchableOpacity>
      // </View>
      //
      //
      // <View style={{flex: 1}}>
      // <TouchableOpacity onPress={this.chooseBolt}>
      // <Image style={styles.ability}  source={require('./images/CardBolt.png')}/>
      // </TouchableOpacity>
      // </View>
      //
      // <View style={{flex: 1}}>
      // <TouchableOpacity onPress={this.chooseSmall}>
      // <Image style={styles.ability}  source={require('./images/CardSmall.png')}/>
      // </TouchableOpacity>
      // </View>
      //
      // <View style={{flex: 1}}>
      // <TouchableOpacity onPress={this.chooseSwag}>
      // <Image style={styles.ability}  source={require('./images/CardSwag.png')}/>
      // </TouchableOpacity>
      // </View>
      <ListView
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

    </View>
  )
  }
})

var GameScreen = React.createClass({
  getInitialState() {
    return({
      test: "test"
    })
  },

  componentWillMount() {
    if (this.props.game.game.users.filter((user) => user.id === this.props.game.user._id)[0].character = "none") {
      console.log('test');
      var self = this;
      setTimeout(function(){
          self.props.navigator.push({
            component: PickAbility,
            title:'Game',
            navigationBarHidden: true
          }, 1);
 }, 1000);
    }
  },

  pickAbility() {
    console.log('why')
    this.props.navigator.push({
      component: PickAbility,
      title:'Game',
      navigationBarHidden: true
    })
  },

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
