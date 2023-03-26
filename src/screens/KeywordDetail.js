import {View, ScrollView, Text} from 'react-native';
import React, {Component} from 'react';
import TradeCard from '../components/TradeCard';
import {fieldName} from '../constant/fieldNames';

export default class KeywordDetail extends Component {
  object = this.props.route.params;
  render() {
    return (
      <View>
        <ScrollView>
          {Object.entries(this.object).map(([key, val], index) => (
            <TradeCard
              key={index}
              Symbol={key}
              Quantity={val.Quantity}
              Profit={val[fieldName.REALIZED_P_L]}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}
