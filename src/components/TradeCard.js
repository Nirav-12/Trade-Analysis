import {Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {fieldName} from '../constant/fieldNames';
import {screen} from '../constant/screens';

export default class TradeCard extends Component {
  render() {
    const {item, navigation} = this.props;
    return (
      <View>
        <TouchableOpacity
          style={{
            height: 40,
            width: 350,
            alignSelf: 'center',
            flexDirection: 'row',
            backgroundColor: '#e9fffd',
          }}
          onPress={() => {
            navigation?.navigate(screen.DETAIL, {item});
          }}>
          <View
            style={{
              flex: 2,

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{item[fieldName.QUANTITY]}</Text>
          </View>
          <View style={{flex: 5, justifyContent: 'center'}}>
            <Text>{item[fieldName.SYMBOL]}</Text>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  color:
                    item[fieldName.REALIZED_P_L] < 0
                      ? '#ff4343'
                      : typeof item[fieldName.REALIZED_P_L] == 'number'
                      ? 'green'
                      : 'black',
                }}>
                {item[fieldName.REALIZED_P_L]}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
