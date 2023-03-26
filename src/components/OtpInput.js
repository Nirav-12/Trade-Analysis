import {View, TextInput} from 'react-native';
import React, {Component, createRef} from 'react';

export default class OtpInput extends Component {
  array =
    Array.isArray(this.props.otpArr) && this.props.otpArr.length
      ? this.props.otpArr
      : new Array(6).fill('');

  arr = new Array(6).fill('');
  constructor(props) {
    super(props);
    this.ref = this.arr.map((val, index) => {
      this.arr[index] = createRef();
    });
  }
  render() {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {this.array.map((val, index) => (
            <TextInput
              style={{
                height: 45,
                width: 40,
                borderRadius: 10,
                backgroundColor: 'white',
                marginRight: 6,
                marginTop: 10,
                padding: 14.5,
              }}
              maxLength={1}
              ref={this.arr[index]}
              key={index}
              onChangeText={val => {
                this.array[index] = Number(val);
                if (val && index < 5) {
                  this.arr[index + 1].current.focus();
                }
                this.props.otpVal(this.array);
              }}
              onSubmitEditing={() => this.props.otpVal(this.array)}
            />
          ))}
        </View>
      </View>
    );
  }
}
