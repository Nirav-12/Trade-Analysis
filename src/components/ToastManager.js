import {View, Text, DeviceEventEmitter, StatusBar} from 'react-native';
import React, {useState, useEffect, Component} from 'react';
import Toast from './Toast';

const ToastManager = () => {
  const [count, setCount] = useState([]);
  const [val, setVal] = useState({});

  useEffect(() => {
    DeviceEventEmitter.addListener('toast', props => {
      setVal(props);
      setCount([...count, 1]);
    });

    DeviceEventEmitter.addListener('hideAll', props => {
      setCount([]);
    });

    DeviceEventEmitter.addListener('hide', props => {
      let arr = [...count];
      var index = arr.indexOf(props);
      if (index !== -1) {
        arr.splice(index, 1);
      }
      setCount(arr);
    });

    return () => DeviceEventEmitter.removeAllListeners();
  }, [count]);

  let [vertical, horizontal] = val?.position ? val.position.split('-') : [];

  return (
    <View
      style={{
        elevation: 1,
        zIndex: 1,
        position: 'absolute',
        justifyContent: 'center',
        top: vertical == 'center' ? 0.5 : null,
        bottom: vertical == 'center' ? 0.5 : vertical == 'bottom' ? 1 : null,
        alignSelf:
          horizontal == 'left'
            ? 'flex-start'
            : horizontal == 'right'
            ? 'flex-end'
            : 'center',
      }}>
      <View style={{}}>
        {count.map((item, index) => {
          let newArray = val => {
            let arr = [...count];
            arr[index] = val;
            setCount(arr);
            console.log(arr);
          };
          return <Toast key={index} val={val} setID={val => newArray(val)} />;
        })}
      </View>
    </View>
  );
};
ToastManager.show = val => {
  DeviceEventEmitter.emit('toast', val);
};

ToastManager.hideAll = () => {
  DeviceEventEmitter.emit('hideAll');
};

ToastManager.hide = val => {
  DeviceEventEmitter.emit('hide', val);
};
export default ToastManager;

// import {View, DeviceEventEmitter} from 'react-native';
// import React, {Component} from 'react';
// import Toast from './Toast';

// export default class ToastManager extends Component {
//   constructor() {
//     super();
//     this.state = {
//       count: [],
//       val: {},
//       isVisible: true,
//     };
//   }

//   componentDidMount() {
//     DeviceEventEmitter.addListener('toast', props => {
//       this.setState({
//         val: props,
//         count: [...this.state.count, 1],
//       });
//     });

//     DeviceEventEmitter.addListener('hideAll', props => {
//       this.setState({
//         count: [],
//       });
//     });

//     DeviceEventEmitter.addListener('hide', props => {
//       let arr = [...this.state.count];
//       var index = arr.indexOf(props);
//       if (index !== -1) {
//         arr.splice(index, 1);
//       }
//       this.setState({
//         count: arr,
//       });
//     });
//   }
//   componentWillUnmount() {
//     DeviceEventEmitter.removeAllListeners();
//   }

//   static show(val) {
//     DeviceEventEmitter.emit('toast', val);
//   }

//   static hideAll() {
//     DeviceEventEmitter.emit('hideAll');
//   }

//   static hide(val) {
//     DeviceEventEmitter.emit('hide', val);
//   }

//   render() {
//     let val = this.state.val;
//     let count = this.state.count;
//     let [vertical, horizontal] = val?.position ? val.position.split('-') : [];

//     return (
//       <View
//         style={{
//           elevation: 1,
//           zIndex: 1,
//           position: 'absolute',
//           justifyContent: 'center',
//           top: vertical == 'center' ? 0.5 : null,
//           bottom: vertical == 'center' ? 0.5 : vertical == 'bottom' ? 1 : null,
//           alignSelf:
//             horizontal == 'left'
//               ? 'flex-start'
//               : horizontal == 'right'
//               ? 'flex-end'
//               : 'center',
//         }}>
//         <View style={{}}>
//           {count.map((item, index) => {
//             let newArray = val => {
//               let arr = [...count];
//               arr[index] = val;
//               this.setState({
//                 count: arr,
//               });
//               console.log(arr);
//             };
//             return <Toast key={index} val={val} setID={val => newArray(val)} />;
//           })}
//         </View>
//       </View>
//     );
//   }
// }
