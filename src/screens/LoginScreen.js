import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, BackHandler} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Input from '../components/Input';
import NaviButton from '../components/NaviButton';
import OtpInput from '../components/OtpInput';
import ToastManager from '../components/ToastManager';

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      phoneNo: '',
      otp: [],
      res: null,
      optScreen: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }
  sendVerification = async () => {
    const confirmation = await auth().signInWithPhoneNumber(
      `+91${this.state.phoneNo}`,
    );
    ToastManager.show({
      text: `OTP snet to ${this.state.phoneNo}`,
      showTimeBar: true,
      position: 'bottom',
    });
    this.setState({optScreen: true, res: confirmation});
  };

  confirmCode = async () => {
    let otpVal = this.state.otp.join('');
    try {
      await this.state.res.confirm(otpVal).then(val => {
        this.onVerification(val.user.uid);
      });
    } catch (error) {
      console.log(error, 'Invalid code.');
    }
  };

  onVerification = async userId => {
    await firestore()
      .collection('users')
      .where('phone', '==', this.state.phoneNo)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size) {
          this.props.navigation.navigate('Home');
        } else {
          this.props.navigation.navigate('SignUp', {
            phoneNo: this.state.phoneNo,
            uid: userId,
          });
        }
      });

    this.setState({phoneNo: null, otp: [], optScreen: false});
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Text style={styles.text1}>Hello Again!</Text>
        <Text style={styles.text2}>Welcome To TradeAnalysis</Text>

        <View style={{marginTop: 80}}>
          {!this.state.optScreen ? (
            <View>
              <Input
                placeholder="Phone Number"
                onChangeText={val => this.setState({phoneNo: val})}
                onSubmitEditing={() => this.sendVerification()}
              />
              <NaviButton
                title="Send OTP"
                onPress={() => this.sendVerification()}
              />
            </View>
          ) : (
            <View>
              <Text style={{color: '#1fbca9', alignSelf: 'center'}}>
                OTP is sent to {this.state.phoneNo}
                {'  '}
                <Text
                  style={{textDecorationLine: 'underline'}}
                  onPress={() => {
                    this.setState({
                      phoneNo: '',
                      res: null,
                      optScreen: false,
                    });
                  }}>
                  click to edit
                </Text>
              </Text>
              <OtpInput
                otpVal={val => this.setState({otp: val})}
                otpArr={this.state.otp}
              />

              <NaviButton
                title="Verify OTP"
                onPress={() => this.confirmCode()}
              />
            </View>
          )}
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
  text1: {
    fontSize: 25,
    fontWeight: '900',
    alignSelf: 'center',
    marginTop: 100,
    color: '#1fbca9',
  },
  text2: {
    fontSize: 23,
    alignSelf: 'center',
    marginTop: 10,
    color: '#1fbca9',
  },
});
