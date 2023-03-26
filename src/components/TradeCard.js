import {Text, View} from 'react-native';
import React, {Component} from 'react';

export default class TradeCard extends Component {
  render() {
    return (
      <View
        style={{
          margin: 2,
          height: 40,
          width: 350,
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{this.props.Quantity}</Text>
        </View>
        <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{this.props.Symbol}</Text>
        </View>
        <View
          style={{
            flex: 2,
            backgroundColor: this.props.Profit < 0 ? '#ff4343' : '#00cc5b',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Text>{this.props.Profit}</Text>
          </View>
        </View>
      </View>
    );
  }
}
