import React, {Component} from 'react';
import NaviButton from '../components/NaviButton';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  Text,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {images} from '../constant/image';
import {screen} from '../constant/screens';
import UploadFile from '../components/UploadFile';
import {fieldName} from '../constant/fieldNames';
import TradeCard from '../components/TradeCard';
import firestore from '@react-native-firebase/firestore';
import {FilterContext} from '../components/FilterContext';

export default class Home extends Component {
  user = auth().currentUser;

  logout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('user log out ');
        this.props.navigation.navigate(screen.LOGIN);
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    const {setTradeData, setFilterData, setFilterVal} = this.context;
    const {navigation} = this.props;

    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.logout();
            }}>
            <Image style={{width: 25, height: 25}} source={images.LOGOUT} />
          </TouchableOpacity>
        </View>
      ),
    });
    BackHandler.addEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
    firestore()
      .collection('trades')
      .get()
      .then(val => {
        let arrData = [];
        let filterArr = [];
        let initVal = [];
        val.forEach(data => {
          if (data._data.uid == this.user.uid) {
            arrData = [...arrData, JSON.parse(data._data.finalObject)];
            initVal = [
              ...initVal,
              ...JSON.parse(data._data.finalObject).tradeDetails,
            ];
            filterArr = [...filterArr, false];
          }
        });
        setTradeData(arrData);
        setFilterData(filterArr);
        setFilterVal(initVal);
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }

  render() {
    const {filterData, filterVal} = this.context;
    const {navigation} = this.props;
    const count = filterData.filter(Boolean).length;
    return (
      <View style={styles.container}>
        <UploadFile />

        <NaviButton
          title="Search"
          onPress={() => {
            navigation.navigate(screen.SEARCH);
          }}
        />
        <FlatList
          data={filterVal}
          ListHeaderComponent={
            <TradeCard
              item={{
                Quantity: fieldName.QUANTITY,
                'Realized P&L': fieldName.REALIZED_P_L,
                Symbol: fieldName.SYMBOL,
              }}
            />
          }
          stickyHeaderIndices={[0]}
          renderItem={({item}) => (
            <TradeCard item={item} navigation={navigation} />
          )}
        />

        <View style={{justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(screen.FILTER);
            }}>
            <View
              style={{
                height: 45,
                backgroundColor: '#33d1c1',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 25, height: 25, marginRight: 10}}
                source={images.FILTER}
              />
              <Text style={{fontSize: 18}}>
                Filter {count != 0 && <Text>{count}</Text>}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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

Home.contextType = FilterContext;
