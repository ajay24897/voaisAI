import {View, Text, Dimensions, Image, StyleSheet} from 'react-native';
import React from 'react';
import Bot from '../../assets/images/bot.png';
import OpenAi from '../../assets/images/open-ai.png';
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
      <Image source={image} style={style.image} />
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

export const OpenAI = () => {
  return (
    <View style={{flex: 1, width}}>
      <Image source={OpenAi} style={style.image} />

      <View style={style.textWrapper}>
        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.heading}>Integrated with OpenAI</Text>
        </LinearTextGradient>

        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.subHeading}>(ChatGPT and DALL·E)</Text>
        </LinearTextGradient>

        <Text style={style.description}>
          For answering all the question & {'\n'}to create image from a
          description
        </Text>
      </View>
    </View>
  );
};

export const TTS = () => {
  return (
    <View style={{flex: 1, width}}>
      <Image source={Bot} style={style.image} />
      <View style={style.textWrapper}>
        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.heading}>Voice Search &</Text>
        </LinearTextGradient>

        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.subHeading}>Read aloud</Text>
        </LinearTextGradient>

        <Text style={style.description}>
          Simply speak your query & get {'\n'}answer into natural-sounding
          speech
        </Text>
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
