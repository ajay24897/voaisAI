import {View, Text, Dimensions, StyleSheet, Animated} from 'react-native';
import React from 'react';

import {LinearTextGradient} from 'react-native-text-gradient';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontsize} from '../../constants/fontsize';
import {primary2} from '../../constants/color';

const {width} = Dimensions.get('window');

const Onboardingscreen = ({item}) => {
  console.log(item);
  const {image, title, subTitle, desc} = item;
  return (
    <View style={{flex: 1, width, padding: responsiveScreenWidth(2)}}>
      <Animated.Image source={image} style={style.image} />
      <View style={style.textWrapper}>
        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.heading}>{title}</Text>
        </LinearTextGradient>

        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.subHeading}>{subTitle}</Text>
        </LinearTextGradient>

        <Text style={style.description}>{desc}</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: responsiveScreenWidth(2),
  },
  heading: {
    fontSize: fontsize.huge,
    fontWeight: '700',
  },
  subHeading: {
    fontSize: fontsize.huge,
    fontWeight: '700',
  },
  description: {
    fontSize: fontsize.medium,
    fontWeight: '300',
    marginTop: responsiveScreenHeight(2),
  },
  image: {
    width: responsiveScreenWidth(60),
    height: responsiveScreenWidth(60),
    alignSelf: 'center',
    marginVertical: responsiveScreenWidth(20),
  },
});
export default Onboardingscreen;
