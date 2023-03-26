import {View, Text, ScrollView} from 'react-native';
import React, {Component} from 'react';
import TradeCard from '../components/TradeCard';

export default class Detail extends Component {
  object = this.props.route.params;
  render() {
    return (
      <View>
        <ScrollView>
          {this.object.tradeDetails.map((val, index) => (
            <TradeCard
              key={index}
              Symbol={val.Symbol}
              Quantity={val.Quantity}
              Profit={val['Realized P&L']}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}
