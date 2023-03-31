import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import FilterCheckBox from '../components/FilterCheckBox';
import {FilterContext} from '../components/FilterContext';

export default class Filter extends Component {
  componentDidMount() {
    const {filterData} = this.context;
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: () => (
        <View>
          {filterData.includes(true) && (
            <TouchableOpacity
              onPress={() => {
                this.clearFilter();
              }}>
              <Text style={{fontSize: 16, color: 'white'}}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
      headerLeft: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              filterData.includes(true)
                ? this.applyFilter()
                : this.clearFilter();
            }}>
            <Text style={{fontSize: 16, color: 'white'}}>Apply</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }

  componentDidUpdate() {
    const {filterData} = this.context;
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: () => (
        <View>
          {filterData.includes(true) && (
            <TouchableOpacity
              onPress={() => {
                this.clearFilter();
              }}>
              <Text style={{fontSize: 16, color: 'white'}}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }

  applyFilter = () => {
    const {navigation} = this.props;
    const {setFilterVal, filterData, tradeData} = this.context;
    let arrfilter = [];
    filterData.map((val, index) => {
      if (val) {
        arrfilter = [...arrfilter, ...tradeData[index].tradeDetails];
      }
    });
    setFilterVal(arrfilter);
    navigation.goBack(null);
  };

  clearFilter = () => {
    const {navigation} = this.props;
    const {setFilterVal, filterData, setFilterData, tradeData} = this.context;
    let arr = [];
    let arrfilter = [];

    filterData.map((val, index) => {
      arr.push(false);
      arrfilter = [...arrfilter, ...tradeData[index].tradeDetails];
    });
    setFilterData(arr);
    setFilterVal(arrfilter);
    navigation.goBack(null);
  };

  render() {
    const {tradeData} = this.context;
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', height: '100%'}}>
          <View style={{flex: 2, backgroundColor: '#e9fffd'}}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'green',
                height: 40,
              }}>
              <Text>Date Range</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 3}}>
            <FlatList
              data={tradeData}
              renderItem={({item, index}) => (
                <FilterCheckBox
                  data={`${item.fromDate} - ${item.toDate}`}
                  index={index}
                />
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

Filter.contextType = FilterContext;
