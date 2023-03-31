import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {Component} from 'react';
import Input from '../components/Input';
import {FilterContext} from '../components/FilterContext';
import DetailCardParent from '../components/DetailCardParent';

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      userData: [],
      keyWords: [],
      symbol: '',
      search: [],
      result: {},
    };
  }

  componentDidMount() {
    const {tradeData} = this.context;
    let arrData = [];
    let keyWord = [];
    tradeData.map((val, index) => {
      keyWord = [...keyWord, ...val.keyWord];
      arrData = [...arrData, ...val.tradeDetails];
    });
    this.setState({userData: arrData, keyWords: keyWord});
  }

  filterSymbol(query) {
    const index = this.state.userData.findIndex(object => {
      return object.Symbol == query?.trim();
    });
    this.setState({result: this.state.userData[index]});
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
      if (valLength == 0) {
        arr = this.state.keyWords;
      }
      this.setState({search: arr, result: {}});

      if (arr.length == 1 && this.state.symbol == arr[0]) {
        this.setState({search: []});
      }
    }
  }

  render() {
    const {result} = this.state;
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View>
            <Input
              placeholder="Search"
              onChangeText={val => this.setState({symbol: val.toUpperCase()})}
              value={this.state.symbol}
              onFocus={() => {
                this.setState({search: this.state.keyWords});
              }}
            />
            {this.state.search.length != 0 &&
              Object.keys(result).length == 0 && (
                <View style={{height: 300}}>
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
              )}
          </View>

          <TouchableOpacity
            onPress={() => this.filterSymbol(this.state.symbol)}
            style={styles.searchButton}>
            <Text style={{color: 'white'}}>Search</Text>
          </TouchableOpacity>
        </View>
        {this.state.search.length == 0 && Object.keys(result).length != 0 && (
          <View>
            <DetailCardParent item={result} />
          </View>
        )}
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

Search.contextType = FilterContext;
