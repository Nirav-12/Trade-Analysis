import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';

export default class NaviButton extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.button} {...this.props}>
        <Text style={styles.btnText}>{this.props.title} </Text>
      </TouchableOpacity>
    );
  }
}

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
