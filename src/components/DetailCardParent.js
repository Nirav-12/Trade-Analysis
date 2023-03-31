import {Text, View} from 'react-native';
import React, {Component} from 'react';
import DetailCard from './DetailCard';
import {fieldName} from '../constant/fieldNames';

export default class DetailCardParent extends Component {
  render() {
    const {item} = this.props;
    console.log('item===>>', item);
    return (
      <View>
        <Text style={{fontSize: 25, alignSelf: 'center', marginTop: 10}}>
          {item[fieldName.SYMBOL]}
        </Text>
        <View style={{marginTop: 20}}>
          <DetailCard
            val={item[fieldName.QUANTITY]}
            name={fieldName.QUANTITY}
          />
          <DetailCard
            val={item[fieldName.BUY_VALUE]}
            name={fieldName.BUY_VALUE}
          />
          <DetailCard
            val={item[fieldName.SELL_VALUE]}
            name={fieldName.SELL_VALUE}
          />
          <DetailCard
            val={item[fieldName.REALIZED_P_L]}
            name={fieldName.REALIZED_P_L}
          />
          <DetailCard
            val={item[fieldName.REALIZED_P_L_PCT]}
            name={fieldName.REALIZED_P_L_PCT}
          />
        </View>
      </View>
    );
  }
}
