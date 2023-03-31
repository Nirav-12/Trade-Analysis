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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeData: [],
    };
  }

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
    this.props.navigation.setOptions({
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
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }

  componentDidUpdate() {
    console.log('home screen ', this.state.tradeData);
  }
  render() {
    return (
      <View style={styles.container}>
        <UploadFile />

        <NaviButton
          title="Search"
          onPress={() => {
            this.props.navigation.navigate(screen.SEARCH);
          }}
        />
        <FlatList
          data={this.state.tradeData}
          renderItem={({item}) => (
            <TradeCard
              Quantity={item[fieldName.QUANTITY]}
              Symbol={item[fieldName.SYMBOL]}
              Profit={item[fieldName.REALIZED_P_L]}
            />
          )}
        />

        <View style={{justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(screen.FILTER, {
                params: {
                  getData: val => {
                    this.setState({tradeData: val});
                  },
                },
              });
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
              <Text style={{fontSize: 18}}>Filter</Text>
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
