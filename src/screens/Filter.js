import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import {images} from '../constant/image';
import firestore from '@react-native-firebase/firestore';
import FilterCheckBox from '../components/FilterCheckBox';

export default class Filter extends Component {
  user = auth().currentUser;

  constructor(props) {
    super(props);
    this.state = {
      date: [],
      filterDate: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.applyFilter();
            }}>
            <Text style={{fontSize: 16, color: 'white'}}>Filter</Text>
          </TouchableOpacity>
        </View>
      ),
    });

    firestore()
      .collection('trades')
      .get()
      .then(val => {
        let arrData = [];
        let filterArr = [];
        val.forEach(data => {
          if (data._data.uid == this.user.uid) {
            arrData = [...arrData, [data._data.fromDate, data._data.toDate]];
          }
        });

        this.setState({date: arrData});
      });
  }

  filterDateFun = (val, index) => {
    let arr = this.state.filterDate;
    arr[index] = val?.split(' ')[0];
    console.log(arr);
    this.setState({filterDate: arr});
  };

  applyFilter() {
    let filterdateVal = [];
    this.state.filterDate.map(val => {
      if (val) {
        filterdateVal.push(val);
      }
    });

    firestore()
      .collection('trades')
      .get()
      .then(val => {
        let arrData = [];
        val.forEach(data => {
          if (data._data.uid == this.user.uid) {
            filterdateVal.map(val => {
              if (val == data._data.fromDate) {
                arrData = [
                  ...arrData,
                  ...JSON.parse(data._data.finalObject).tradeDetails,
                ];
              }
            });
          }
        });
        // console.log(arrData);
        this.props.route.params.params.getData(arrData);
      });

    this.props.navigation.goBack(null);
  }

  clearFilter() {
    this.setState({filterDate: []});
  }

  render() {
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
            <View
              style={{
                flex: 1,
                marginBottom: 20,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => this.clearFilter()}>
                <Text style={{fontWeight: 'bold', color: '#1fbca9'}}>
                  Clear Filter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 3}}>
            <FlatList
              data={this.state.date}
              renderItem={({item, index}) => (
                <FilterCheckBox
                  data={`${item[0]} - ${item[1]}`}
                  val={index}
                  filterDate={this.filterDateFun}
                  clearFilter={this.state.clearFilter}
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
