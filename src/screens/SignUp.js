import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Input from '../components/Input';
import NaviButton from '../components/NaviButton';

const SignUp = ({route, navigation}) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [PAN, setPAN] = useState(null);

  const signup = async () => {
    await firestore()
      .collection('user')
      .doc(route.params.uid)
      .set({
        id: route.params.uid,
        firstName: firstName,
        lastName: lastName,
        phone: route.params.phoneNo,
        email: email,
        PAN: PAN,
      })
      .then(() => {
        navigation.navigate('FileUpload');
      });
  };

  const emailValidate = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(val) == false) {
      setEmail(null);
    } else {
      setEmail(val);
    }
  };

  const panValidation = val => {
    let reg = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (reg.test(val) == false) {
      setPAN(null);
    } else {
      setPAN(val);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Input
          width={130}
          margin={5}
          placeholder="First Name"
          onChangeText={val => setFirstName(val)}
        />
        <Input
          width={130}
          margin={5}
          placeholder="Last Name"
          onChangeText={val => setLastName(val)}
        />
      </View>

      <Input placeholder={route.params.phoneNo} editable={false} />
      <Input
        placeholder="Email ID"
        onChangeText={val => {
          emailValidate(val);
        }}
      />
      <Input placeholder="PAN" onChangeText={val => panValidation(val)} />

      <NaviButton
        title="SignUp"
        onPress={() => {
          if (!firstName) {
            alert('please enter correct firstName');
          } else if (!lastName) {
            alert('please enter correct lastName');
          } else if (!email) {
            alert('please enter correct email');
          } else if (!PAN) {
            alert('please enter correct PAN');
          } else {
            signup();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fffd',
  },
  textInput: {
    borderWidth: 1,
    margin: 10,
    width: 300,
  },
  textInput1: {
    borderWidth: 1,
    margin: 10,
    width: 140,
  },
});

export default SignUp;
