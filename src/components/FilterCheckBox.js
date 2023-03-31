import {Text, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';

export default class FilterCheckBox extends Component {
  constructor() {
    super();
    this.state = {
      check: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.check != prevState.check) {
      if (this.state.check) {
        this.props.filterDate(this.props.data, this.props.val);
      } else {
        this.props.filterDate(null, this.props.val);
      }
    }
  }

  render() {
    return (
      <View
        style={{
          height: 45,
          alignItems: 'center',
          flexDirection: 'row',
          marginLeft: 10,
        }}>
        <TouchableOpacity
          onPress={() => this.setState({check: !this.state.check})}
          style={{
            backgroundColor: this.state.check ? 'black' : null,
            borderWidth: 2,
            height: 20,
            width: 20,
          }}></TouchableOpacity>
        <Text style={{marginLeft: 10}}>{this.props.data}</Text>
      </View>
    );
  }
}
