import {View, ScrollView} from 'react-native';
import React from 'react';
import TradeCard from '../components/TradeCard';
import {fieldName} from '../constant/fieldNames';

const KeywordDetail = props => {
  let object = props.route.params;
  return (
    <View>
      <ScrollView>
        {Object.entries(object).map(([key, val], index) => (
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
};

export default KeywordDetail;
