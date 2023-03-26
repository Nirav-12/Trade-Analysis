import React, {Component} from 'react';
import {TextInput, View, StyleSheet, Text} from 'react-native';

export default class Input extends Component {
  render() {
    return (
      <View style={{boxShadow: '30px'}}>
        <TextInput
          placeholder={this.props.placeholder}
          style={[styles.textInput]}
          {...this.props}
          // placeholderTextColor={'gray'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    height: 45,
    width: 270,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    marginTop: 20,
    // borderWidth: 1,
    // borderColor: '#33d1c1',
    // shadowColor: '#33d1c1',
    // shadowOpacity: 0.2,
    // elevation: 24,
  },
});

// export default Input;
