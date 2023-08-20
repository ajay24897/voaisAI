import {View, Text, Dimensions, StyleSheet, Animated} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontsize} from '../../constants/fontsize';
import {grey, primary2} from '../../constants/color';
import {GradientText} from '../../commonComponents.js/GradientText';

const {width} = Dimensions.get('window');

const Onboardingscreen = ({item}) => {
  console.log(item);
  const {image, title, subTitle, desc} = item;
  return (
    <View style={style.wrapper}>
      <Animated.Image
        source={image}
        style={style.image}
        resizeMode={'contain'}
      />
      <View style={style.textWrapper}>
        <GradientText
          style={style.heading}
          colors={[primary2[500], primary2[100]]}>
          {title}
        </GradientText>
        <GradientText
          style={style.heading}
          colors={[primary2[500], primary2[100]]}>
          {subTitle}
        </GradientText>

        <Text style={style.description}>{desc}</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {flex: 1, width, padding: responsiveScreenWidth(2)},
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
    color: grey[200],
    letterSpacing: 2,
  },
  image: {
    width: responsiveScreenWidth(100),
    height: responsiveScreenWidth(60),
    alignSelf: 'center',
    marginVertical: responsiveScreenWidth(20),
  },
});
export default Onboardingscreen;
