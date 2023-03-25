import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import FileUpload from './src/screens/FileUpload';
import SignUp from './src/screens/SignUp';
import KeywordDetail from './src/screens/KeywordDetail';
import ToastManager from './src/components/ToastManager';
import Practice from './src/screens/Practice';
import Detail from './src/screens/Detail';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

function App() {
  const user = auth().currentUser;
  return (
    <NavigationContainer>
      <ToastManager />
      <Stack.Navigator
        initialRouteName={user ? 'FileUpload' : 'Home'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1fbca9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: ''}}
        />
        <Stack.Screen
          name="FileUpload"
          component={FileUpload}
          options={{
            title: 'Trade Analysis',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerBackVisible: false, gestureEnabled: false}}
        />

        <Stack.Screen name="Detail" component={Detail} options={{title: ''}} />
        <Stack.Screen
          name="KeywordDetail"
          component={KeywordDetail}
          options={{title: ''}}
        />
        <Stack.Screen name="Practice" component={Practice} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

// import React, {Component} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import HomeScreen from './src/screens/HomeScreen';
// import FileUpload from './src/screens/FileUpload';
// import SignUp from './src/screens/SignUp';
// import KeywordDetail from './src/screens/KeywordDetail';
// import ToastManager from './src/components/ToastManager';
// import Practice from './src/screens/Practice';
// import Detail from './src/screens/Detail';
// import auth from '@react-native-firebase/auth';

// export default class App extends Component {
//   render() {
//     const Stack = createNativeStackNavigator();

//     const user = auth().currentUser;
//     return (
//       <NavigationContainer>
//         <ToastManager />
//         <Stack.Navigator
//           initialRouteName={user ? 'FileUpload' : 'Home'}
//           screenOptions={{
//             headerStyle: {
//               backgroundColor: '#1fbca9',
//             },
//             headerTintColor: '#fff',
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//           }}>
//           <Stack.Screen
//             name="Home"
//             component={HomeScreen}
//             options={{title: ''}}
//           />
//           <Stack.Screen
//             name="FileUpload"
//             component={FileUpload}
//             options={{
//               title: 'Trade Analysis',
//               headerBackVisible: false,
//               gestureEnabled: false,
//             }}
//           />
//           <Stack.Screen
//             name="SignUp"
//             component={SignUp}
//             options={{headerBackVisible: false, gestureEnabled: false}}
//           />

//           <Stack.Screen
//             name="Detail"
//             component={Detail}
//             options={{title: ''}}
//           />
//           <Stack.Screen
//             name="KeywordDetail"
//             component={KeywordDetail}
//             options={{title: ''}}
//           />
//           <Stack.Screen name="Practice" component={Practice} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }
