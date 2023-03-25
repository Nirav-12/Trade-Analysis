import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const Practice = () => {
  return (
    <View
      style={{
        width: 250,
        backgroundColor: 'skyblue',
        margin: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            paddingRight: 15,
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 22, height: 22}}
            source={require('../asset/info.png')}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: 900}}>Info</Text>
          <Text style={{}}>good morning</Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => console.log('close modal')}>
            <Text style={{fontSize: 18, fontWeight: 700}}>x</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: 4, backgroundColor: 'black'}}></View>
    </View>
  );
};

export default Practice;
