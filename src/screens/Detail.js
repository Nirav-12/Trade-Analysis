import {View, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import DetailCardParent from '../components/DetailCardParent';

export default class Detail extends Component {
  render() {
    const {navigation, route} = this.props;
    const {item} = route.params;
    console.log(item);
    return (
      <View style={styles.container}>
        <DetailCardParent item={item} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fffd',
  },
});
