import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import React, {Component} from 'react';
import Success from '../asset/success.png';
import Warn from '../asset/warn.png';
import Error from '../asset/error.png';
import Info from '../asset/info.png';
import {images} from '../constant/image';

export default class Toast extends Component {
  color = 'green';
  image = images.SUCCESS;

  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      width: new Animated.Value(0),
      opacity: new Animated.Value(0),
      duration: this.props.val.duration || 3000,
    };
  }
  close = val => {
    this.setState({isVisible: false});
  };

  componentDidMount() {
    const id = setTimeout(() => {
      this.setState({isVisible: false});
    }, this.state.duration);
    this.props.setID(id);

    Animated.timing(this.state.width, {
      toValue: 1,
      duration: this.state.duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  componentDidUpdate() {
    if (this.state.isVisible == false) {
      if (this.state.isVisible == false && this.props.val?.onClose) {
        this.props.val?.onClose();
      }
    }
  }

  render() {
    if (this.props.val?.type == 'Warn') {
      color = '#f4a838';
      image = images.WARN;
    }
    if (this.props.val?.type == 'Error') {
      color = 'red';
      image = images.ERROR;
    }
    if (this.props.val?.type == 'Info') {
      color = 'skyblue';
      image = images.INFO;
    }
    widthVal = this.state.width.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 250],
    });
    if (this.state.isVisible) {
      return (
        <Animated.View
          style={{
            opacity: this.state.opacity,
            marginTop: 10,
            width: 250,
            backgroundColor: this.color,
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
              {this.props.val?.imageChild ?? (
                <Image style={{width: 22, height: 22}} source={this.image} />
              )}
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontWeight: this.props.val?.textStyle?.fontWeight || 900,
                  fontSize: this.props.val?.textStyle?.fontSize,
                  color: this.props.val?.textStyle?.color,
                }}>
                {this.props.val?.header ?? this.props.val?.type ?? 'Success'} !
              </Text>
              <Text
                style={{
                  fontWeight: this.props.val?.subTextStyle?.fontWeight,
                  fontSize: this.props.val?.subTextStyle?.fontSize,
                  color: this.props.val?.subTextStyle?.color,
                }}>
                {this.props.val?.text}
              </Text>
            </View>
            {this.props.val?.showCloseButton && (
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this.close()}>
                  <Text style={{fontSize: 18, fontWeight: 700}}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View>
            {this.props.val?.showTimeBar && (
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
  }
}

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
