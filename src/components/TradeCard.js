import React, {useState, useEffect} from 'react';

import {View, Text} from 'react-native';

const TradeCard = props => {
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
        <Text>{props.Quantity}</Text>
      </View>
      <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{props.Symbol}</Text>
      </View>
      <View
        style={{
          flex: 2,
          backgroundColor: props.Profit < 0 ? '#ff4343' : '#00cc5b',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <Text>{props.Profit}</Text>
        </View>
      </View>
    </View>
  );
};

export default TradeCard;
