import {View, Text, Dimensions, Image, StyleSheet} from 'react-native';
import React from 'react';
const {width, height} = Dimensions.get('window');
import Bot from '../../assets/images/bot.png';
import OpenAi from '../../assets/images/open-ai.png';
import {LinearTextGradient} from 'react-native-text-gradient';

import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontsize} from '../../constants/fontsize';
import {primary, primary2} from '../../constants/color';

const Home = () => {
  return (
    <View style={{flex: 1, width, padding: responsiveScreenWidth(2)}}>
      <Image
        source={Bot}
        style={{
          width: responsiveScreenWidth(60),
          height: responsiveScreenWidth(60),
          alignSelf: 'center',
          marginVertical: responsiveScreenWidth(20),
        }}
      />
      <View style={style.textWrapper}>
        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.heading}>VoaisAI : Your own</Text>
        </LinearTextGradient>

        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary2[500], primary2[100]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={style.subHeading}>AI Assistant</Text>
        </LinearTextGradient>

        <Text style={style.description}>
          VoaisAI can answer for followup {'\n'}questions and be your advisor
        </Text>
      </View>
    </View>
  );
};

export const OpenAI = () => {
  return (
    <View style={{flex: 1, width}}>
      <Image
        source={OpenAi}
        style={{
          width: responsiveScreenWidth(60),
          height: responsiveScreenWidth(60),
          alignSelf: 'center',
          marginVertical: responsiveScreenWidth(20),
        }}
      />

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
          <Text style={style.subHeading}>ChatGPT and DALL·E</Text>
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
      <Image
        source={Bot}
        style={{
          width: responsiveScreenWidth(60),
          height: responsiveScreenWidth(60),
          alignSelf: 'center',
          marginVertical: responsiveScreenWidth(20),
        }}
      />
      <View style={style.textWrapper}>
        <LinearTextGradient
          numberOfLines={1}
          useViewFrame={true}
          locations={[0, 1]}
          colors={[primary[500], primary2[100]]}
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
    fontWeight: '700',
    marginTop: responsiveScreenHeight(2),
  },
});
export default Home;
