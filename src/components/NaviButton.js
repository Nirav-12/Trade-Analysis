import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

const NaviButton = props => {
  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.btnText}>{props.title} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: 270,
    marginVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#33d1c1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#d5fffc',
    shadowOpacity: 1,
    elevation: 30,
  },
  btnText: {color: '#ffffff'},
});

export default NaviButton;
