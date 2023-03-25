import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import TradeCard from '../components/TradeCard';

const Detail = props => {
  let object = props.route.params;
  console.log('props', JSON.stringify(object.tradeDetails));
  return (
    <View>
      <ScrollView>
        {object.tradeDetails.map((val, index) => (
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
};

export default Detail;
