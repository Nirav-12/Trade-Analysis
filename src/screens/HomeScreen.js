import {
  View,
  Button,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Input from '../components/Input';
import NaviButton from '../components/NaviButton';
import OtpInput from '../components/OtpInput';
import ToastManager from '../components/ToastManager';

const HomeScreen = ({navigation}) => {
  const [phoneNo, setPhoneNo] = useState('');
  const [otp, setOTP] = useState([]);
  const [res, setRes] = useState(null);
  const [optScreen, setOtpScreen] = useState(false);

  const sendVerification = async () => {
    const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNo}`);
    ToastManager.show({
      text: `OTP snet to ${phoneNo}`,
      showTimeBar: true,
      position: 'bottom',
    });
    setOtpScreen(true);
    setRes(confirmation);
  };

  const confirmCode = async () => {
    let otpVal = otp.join('');
    try {
      await res.confirm(otpVal).then(val => {
        onVerification(val.user.uid);
      });
    } catch (error) {
      console.log(error, 'Invalid code.');
    }
  };

  const onVerification = userId => {
    firestore()
      .collection('user')
      .where('phone', '==', phoneNo)
      .get()
      .then(querySnapshot => {
        setPhoneNo(null);
        setOTP(null);
        setOtpScreen(false);
        if (querySnapshot.size) {
          navigation.navigate('FileUpload');
        } else {
          navigation.navigate('SignUp', {phoneNo: phoneNo, uid: userId});
        }
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.text1}>Hello Again!</Text>
      <Text style={styles.text2}>Welcome To TradeAnalysis</Text>

      <View style={{marginTop: 80}}>
        {!optScreen ? (
          <View>
            <Input
              placeholder="Phone Number"
              onChangeText={val => setPhoneNo(val)}
              onSubmitEditing={() => sendVerification()}
            />
            <NaviButton title="Send OTP" onPress={() => sendVerification()} />
          </View>
        ) : (
          <View>
            <Text style={{color: '#1fbca9', alignSelf: 'center'}}>
              OTP is sent to {phoneNo}
              {'  '}
              <Text
                style={{textDecorationLine: 'underline'}}
                onPress={() => {
                  setPhoneNo('');
                  setOtpScreen(false);
                  setRes(null);
                }}>
                click to edit
              </Text>
            </Text>
            <OtpInput otpVal={val => setOTP(val)} otpArr={otp} />

            <NaviButton title="Verify OTP" onPress={() => confirmCode()} />
          </View>
        )}
      </View>
    </View>
  );
};

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

export default HomeScreen;
