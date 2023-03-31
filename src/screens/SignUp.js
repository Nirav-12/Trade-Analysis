import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import React, {Component} from 'react';
import firestore from '@react-native-firebase/firestore';
import Input from '../components/Input';
import NaviButton from '../components/NaviButton';
import {screen} from '../constant/screens';
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      PAN: null,
    };
  }

  signup = async () => {
    await firestore()
      .collection('users')
      .doc(this.props.route.params.uid)
      .set({
        id: this.props.route.params.uid,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.props.route.params.phoneNo,
        email: this.state.email,
        PAN: this.state.PAN,
      })
      .then(() => {
        this.props.navigation.navigate(screen.HOME);
      });
  };

  emailValidate(val) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(val) == false) {
      this.setState({
        email: null,
      });
    } else {
      this.setState({
        email: val,
      });
    }
  }

  panValidation = val => {
    let reg = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (reg.test(val) == false) {
      this.setState({
        PAN: null,
      });
    } else {
      this.setState({
        PAN: val,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Input
            width={130}
            margin={5}
            placeholder="First Name"
            onChangeText={val => this.setState({firstName: val})}
          />
          <Input
            width={130}
            margin={5}
            placeholder="Last Name"
            onChangeText={val => this.setState({lastName: val})}
          />
        </View>

        <Input
          placeholder={this.props.route.params?.phoneNo}
          editable={false}
        />
        <Input
          placeholder="Email ID"
          onChangeText={val => {
            this.emailValidate(val);
          }}
        />
        <Input
          placeholder="PAN"
          onChangeText={val => this.panValidation(val)}
        />

        <NaviButton
          title="SignUp"
          onPress={() => {
            if (!this.state.firstName) {
              alert('please enter correct firstName');
            } else if (!this.state.lastName) {
              alert('please enter correct lastName');
            } else if (!this.state.email) {
              alert('please enter correct email');
            } else if (!this.state.PAN) {
              alert('please enter correct PAN');
            } else {
              this.signup();
            }
          }}
        />
      </View>
    );
  }
}

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
