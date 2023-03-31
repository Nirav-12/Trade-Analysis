import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {Component} from 'react';
import Input from '../components/Input';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class Search extends Component {
  user = auth().currentUser;

  constructor() {
    super();
    this.state = {
      userData: [],
      keyWords: [],
      symbol: '',
      search: [],
    };
  }

  componentDidMount() {
    firestore()
      .collection('trades')
      .get()
      .then(val => {
        let arrData = [];
        let keyWord = [];
        val.forEach(data => {
          if (data._data.uid == this.user.uid) {
            arrData = [
              ...arrData,
              ...JSON.parse(data._data.finalObject).tradeDetails,
            ];
            keyWord = [
              ...keyWord,
              ...JSON.parse(data._data.finalObject).keyWord,
            ];
          }
        });
        this.setState({userData: arrData, keyWords: keyWord});
      });
  }

  filterSymbol(query) {
    const index = this.state.userData.findIndex(object => {
      return object.Symbol == query?.trim();
    });
    console.log(this.state.userData[index]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.symbol != prevState.symbol) {
      let arr = [];
      let valLength = this.state.symbol.length;

      if (valLength) {
        for (let i = 0; i < this.state.keyWords.length; i++) {
          if (this.state.symbol == this.state.keyWords[i].slice(0, valLength)) {
            arr.push(this.state.keyWords[i]);
          }
        }
      }

      this.setState({search: arr});
      if (arr.length == 1 && this.state.symbol == arr[0]) {
        this.setState({search: []});
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View>
            <Input
              placeholder="Search"
              onChangeText={val => this.setState({symbol: val})}
              value={this.state.symbol}
            />

            <FlatList
              data={this.state.search}
              bounces={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    height: 45,
                    padding: 10,

                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({symbol: item})}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.filterSymbol(this.state.symbol)}
            style={styles.searchButton}>
            <Text style={{color: 'white'}}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fffd',
  },
  searchButton: {
    height: 45,
    width: 50,
    marginVertical: 20,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#33d1c1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
