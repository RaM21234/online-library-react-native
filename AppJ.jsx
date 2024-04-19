import React from 'react';
import Home from './src/screens/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Update from './src/screens/Update';
import Upload from './src/screens/Upload';

const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Update"
        component={Update}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </>
  );
};
