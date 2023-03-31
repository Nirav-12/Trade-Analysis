import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import Home from './src/screens/Home';
import FileUploadScreen from './src/screens/FileUploadScreen';
import SignUp from './src/screens/SignUp';
import KeywordDetail from './src/screens/KeywordDetail';
import ToastManager from './src/components/ToastManager';
import Practice from './src/screens/Practice';
import Detail from './src/screens/Detail';
import auth from '@react-native-firebase/auth';
import Filter from './src/screens/Filter';
import {screen} from './src/constant/screens';
import Search from './src/screens/Search';

export default class App extends Component {
  render() {
    const Stack = createNativeStackNavigator();

    const user = auth().currentUser;
    return (
      <NavigationContainer>
        <ToastManager />
        <Stack.Navigator
          initialRouteName={user ? screen.HOME : screen.LOGIN}
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
            name={screen.LOGIN}
            component={LoginScreen}
            options={{
              title: '',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name={screen.HOME}
            component={Home}
            options={{
              title: 'Trade Analysis',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          {/* <Stack.Screen
            name={screen.FILE_UPLOAD}
            component={FileUploadScreen}
            options={{
              title: 'Trade Analysis',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          /> */}
          <Stack.Screen
            name={screen.SIGNUP}
            component={SignUp}
            options={{headerBackVisible: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name={screen.DETAIL}
            component={Detail}
            options={{title: ''}}
          />
          <Stack.Screen
            name={screen.KEYWORD_DETAIL}
            component={KeywordDetail}
            options={{title: ''}}
          />
          <Stack.Screen
            name={screen.FILTER}
            component={Filter}
            options={{title: ''}}
          />

          <Stack.Screen
            name={screen.SEARCH}
            component={Search}
            options={{title: ''}}
          />

          {/* <Stack.Screen name={screen.PRACTICE} component={Practice} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
