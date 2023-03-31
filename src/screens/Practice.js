import {Button, Text, View} from 'react-native';
import React, {Component} from 'react';

export default class Practice extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }
  componentDidUpdate() {}

  render() {
    let {val} = this.props;
    console.log('props', val);
    return (
      <View>
        <Text>{this.state.count}</Text>
        <Button
          title="add"
          onPress={() => this.setState({count: this.state.count + 1})}
        />
      </View>
    );
  }
}
