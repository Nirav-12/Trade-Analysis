import {View, TextInput} from 'react-native';
import React, {useRef, createRef} from 'react';

const OtpInput = props => {
  const ref = useRef([]);

  let array =
    Array.isArray(props.otpArr) && props.otpArr.length
      ? props.otpArr
      : new Array(6).fill('');
  ref.current = array.map((element, i) => ref.current[i] ?? createRef());

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {array.map((val, index) => (
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
            ref={ref.current[index]}
            key={index}
            onChangeText={val => {
              array[index] = Number(val);
              if (val && index < 5) {
                ref.current[index + 1].current.focus();
              }
              props.otpVal(array);
            }}
            onSubmitEditing={() => props.otpVal(array)}
          />
        ))}
      </View>
    </View>
  );
};

export default OtpInput;
