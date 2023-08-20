import React, {useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {commonColors, grey, primary2, secondary} from '../../constants/color';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontsize} from '../../constants/fontsize';
import Bot from '../../assets/images/bot.png';
import OpenAi from '../../assets/images/open-ai.png';
import VoiceSearch from '../../assets/images/voiceSearch2.png';

import Onboardingscreen from './onboardingPages';
import {GradientText} from '../../commonComponents.js/GradientText';

const {width} = Dimensions.get('window');

const slides = [
  {
    image: Bot,
    title: 'VoaisAI : Your own',
    subTitle: 'AI Assistant',
    desc: 'VoaisAI can answer for followup \nquestions & be your advisor',
    page: 'landingPage',
  },
  {
    image: OpenAi,
    title: 'Integrated with OpenAI',
    subTitle: '(ChatGPT & DALL·E)',
    desc: 'For answering all the question & \nto create image from a description',
    page: 'openAi',
  },
  {
    image: VoiceSearch,
    title: 'Voice search &',
    subTitle: 'Read aloud feature',
    desc: 'Simply speak your query & get \nanswer into natural-sounding speech',
    page: 'tts',
  },
];

export default function Onboarding({navigation}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);

  const handleSlide = e => {
    const xOffset = e.nativeEvent.contentOffset.x;
    setCurrentSlide(Math.round(xOffset / width));
  };

  const handleNextClick = () => {
    if (slides.length === currentSlide + 1) {
      OnboardingFlowDone();
      return;
    }
    const offset = width * (currentSlide + 1);
    flatListRef?.current?.scrollToOffset({offset});
    setCurrentSlide(Prev => Prev + 1);
  };

  const OnboardingFlowDone = async () => {
    // dispatch(onboardingDone());
    navigation.replace('search');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={secondary[500]} />
      <FlatList
        ref={flatListRef}
        onMomentumScrollEnd={e => handleSlide(e)}
        pagingEnabled
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => <Onboardingscreen item={item} />}
        contentContainerStyle={{}}
        initialNumToRender={1}
      />

      <View style={styles.footerWrapper}>
        <Indicator currentSlide={currentSlide} />
        <TouchableOpacity onPress={handleNextClick}>
          <GradientText
            style={styles.nextCTA}
            colors={[primary2[500], primary2[100]]}>
            Next
          </GradientText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Indicator = ({currentSlide}) => {
  return (
    <View style={styles.indicatorWrapper}>
      <View style={styles.indicatorConent}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  index === currentSlide ? commonColors.white : grey[400],
              },
              styles.indicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: secondary[500]},
  footerWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveScreenWidth(4),
    alignItems: 'center',
    paddingVertical: responsiveScreenHeight(2),
  },
  indicatorWrapper: {
    justifyContent: 'space-between',
  },
  indicatorConent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    marginLeft: responsiveScreenWidth(1),
    height: responsiveScreenWidth(2),
    width: responsiveScreenWidth(2),
    borderRadius: responsiveScreenHeight(2),
  },
  nextCTA: {
    fontSize: fontsize.medium,
    letterSpacing: 1.5,
  },
});
