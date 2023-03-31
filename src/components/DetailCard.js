import {Text, View} from 'react-native';
import React, {Component} from 'react';

export default class DetailCard extends Component {
  render() {
    const {name, val} = this.props;
    return (
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, marginRight: 20}}>
          {name}
        </Text>
        <Text style={{fontSize: 20}}>{val}</Text>
      </View>
    );
  }
}
