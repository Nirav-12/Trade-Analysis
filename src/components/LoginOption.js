import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';

const LoginOption = (props, {navigation}) => {
  return (
    <View>
      <TouchableOpacity style={styles.button} {...props}>
        <Image source={props.img} style={styles.imgSty} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: 70,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e9fffd',
    alignSelf: 'center',
    backgroundColor: '#e4f0f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgSty: {
    height: 30,
    width: 30,
  },
});

export default LoginOption;
