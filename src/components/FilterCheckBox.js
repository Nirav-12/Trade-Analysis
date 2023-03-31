import {Text, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {FilterContext} from './FilterContext';

export default class FilterCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
    };
  }

  handlePress = () => {
    const {index} = this.props;
    const {filterData, setFilterData} = this.context;
    let arr = filterData;
    arr[index] = !filterData[index];
    setFilterData(arr);
  };

  render() {
    const {filterData} = this.context;
    const {data, index} = this.props;
    return (
      <View
        style={{
          height: 45,
          alignItems: 'center',
          flexDirection: 'row',
          marginLeft: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.handlePress();
          }}
          style={{
            backgroundColor: filterData[index] ? 'black' : null,
            borderWidth: 2,
            height: 20,
            width: 20,
          }}></TouchableOpacity>
        <Text style={{marginLeft: 10}}>{data}</Text>
      </View>
    );
  }
}

FilterCheckBox.contextType = FilterContext;
