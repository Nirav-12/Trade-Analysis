import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Success from '../asset/success.png';
import Warn from '../asset/warn.png';
import Error from '../asset/error.png';
import Info from '../asset/info.png';

const Toast = ({val, setID}) => {
  const [isVisible, setVisible] = useState(true);
  const [width, setwidth] = useState(new Animated.Value(0));
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible == false && val?.onClose) {
      val?.onClose();
    }
  }, [isVisible]);

  useEffect(() => {
    const id = setTimeout(() => {
      setVisible(false);
    }, duration);

    setID(id);

    Animated.timing(width, {
      toValue: 1,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  let widthVal = width.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  let duration = val?.duration || 3000;

  const close = val => {
    setVisible(false);
    clearInterval(val);
  };

  let color = 'green';
  let image = Success;

  if (val?.type == 'Warn') {
    color = '#f4a838';
    image = Warn;
  }
  if (val?.type == 'Error') {
    color = 'red';
    image = Error;
  }
  if (val?.type == 'Info') {
    color = 'skyblue';
    image = Info;
  }

  if (isVisible) {
    return (
      <Animated.View
        style={{
          opacity: opacity,
          marginTop: 10,
          width: 250,
          backgroundColor: color,
          marginTop: 10,
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
            {val?.imageChild ?? (
              <Image style={{width: 22, height: 22}} source={image} />
            )}
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontWeight: val?.textStyle?.fontWeight || 900,
                fontSize: val?.textStyle?.fontSize,
                color: val?.textStyle?.color,
              }}>
              {val?.header ?? val?.type ?? 'Success'} !
            </Text>
            <Text
              style={{
                fontWeight: val?.subTextStyle?.fontWeight,
                fontSize: val?.subTextStyle?.fontSize,
                color: val?.subTextStyle?.color,
              }}>
              {val?.text}
            </Text>
          </View>
          {val?.showCloseButton && (
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => close()}>
                <Text style={{fontSize: 18, fontWeight: 700}}>x</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View>
          {val?.showTimeBar && (
            <Animated.View
              style={{
                height: 4,
                backgroundColor: 'black',
                width: widthVal,
              }}></Animated.View>
          )}
        </View>
      </Animated.View>
    );
  }
};

export default Toast;

// ToastManager Methods

// ==>show()
// to show modal

// showTimeBar        ==> true,false                            default=> false
// showCloseButton    ==> true,false                            default=> false
// text               ==> text to be display on toast           default=> null
// type               ==> Warn,Info,Error                       default=> Success
// header             ==> header text                           default=> type name
// duration           ==> toast visibility time on screen       default=> 3000
// position           ==> top-left,top-center,top-right,bottom-left,bottom-center,bottom-right,center-left,center,center-right default=> top-center
// onClose            ==> call back when toast close
// textStyle          ==> header text style {fontWeight , fontSize, color}
// subTextStyle       ==> message text style {fontWeight , fontSize, color}
// imageChild         ==> pass child component instead of image

// ==>hideAll()
// close all toast on screen

// ==> hide()
// it take id of time out and hide partiular toast on id

// example of ToastManager

// <Button
// title="Show Toast"
// onPress={() => {
//   ToastManager.show({
//     text: 'hello',
//     duration: 100000,
//     showCloseButton: true,
//     showTimeBar: true,
//   });
// }}
// />

// <Button title="hideAll" onPress={() => ToastManager.hideAll()} />
// <Button title="hide" onPress={() => ToastManager.hide(7)} />
