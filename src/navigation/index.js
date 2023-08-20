import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Onboarding from '../screens/onboarding';
import Search from '../screens/search';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="onboarding"
          component={Onboarding}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="search"
          component={Search}
          options={{headerShown: false}}
        />

        {}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
