import {Text, View} from 'react-native';
import React, {Component, createContext} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {FilterContext} from './FilterContext';

export default class MyFilterContext extends Component {
  user = auth().currentUser;

  constructor() {
    super();
    this.state = {
      tradeData: [],
      filterData: [],
      filterVal: [],
    };
  }

  render() {
    return (
      <FilterContext.Provider
        value={{
          tradeData: this.state.tradeData,
          setTradeData: val => this.setState({tradeData: val}),
          filterData: this.state.filterData,
          setFilterData: val => this.setState({filterData: val}),
          filterVal: this.state.filterVal,
          setFilterVal: val => this.setState({filterVal: val}),
        }}>
        {this.props.children}
      </FilterContext.Provider>
    );
  }
}
