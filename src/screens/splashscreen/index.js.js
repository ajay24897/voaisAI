import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonColors} from '../../constants/color';

const SplashScreen = props => {
  useEffect(() => {
    checkOnboardingDone();
  }, []);

  async function checkOnboardingDone() {
    const onboarding_done = await AsyncStorage.getItem('onboarding_done');
    if (onboarding_done) {
      props.navigation.replace('search');
    } else {
      props.navigation.replace('onboarding');
    }
  }
  return <View style={style.container}>{/* animation*/}</View>;
};

const style = StyleSheet.create({
  container: {flex: 1, backgroundColor: commonColors.black},
});

export default SplashScreen;
