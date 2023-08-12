// import {View, Text} from 'react-native';
// import React from 'react';

// export default function Onboarding() {
//   return (
//     <View>
//       <Text>Onboarding</Text>
//     </View>
//   );
// }
import React, {useRef, useState} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
// import {FlatList} from 'react-native-gesture-handler';
// import {Button} from '@react-native-material/core';
import {color, grey, secondary} from '../../constants/color';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Home, {OpenAI, TTS} from './home';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: 1,
    // image: require('../../assets/ease.png'),
    title: 'Integaration with OpenAI',
    desc: 'Note down your most important notes with ease',
    page: 'home',
  },
  {
    id: 2,
    // image: require('../../assets/search.png'),
    title: 'Dall - E',
    desc: 'Search your note quickly and easily',
    page: 'openAi',
  },
  {
    id: 3,
    // image: require('../../assets/quick-access.png'),
    title: 'Quick Access',
    desc: 'Access your notes from anywhere using App and keep your self upto date',
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

  const handleSkip = () => {
    OnboardingFlowDone();
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
        renderItem={({item}) => <Slide item={item} />}
        contentContainerStyle={{}}
      />

      <View style={styles.footerWrapper}>
        <Button onPress={handleSkip} title="Skip" />

        <Indicator currentSlide={currentSlide} />

        <Button onPress={handleNextClick} title="Next" />
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
                backgroundColor: index === currentSlide ? '#fff' : grey[400],
              },
              styles.indicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

function Slide({item}) {
  console.log(item.page);

  switch (item.page) {
    case 'home':
      return <Home />;

    case 'openAi':
      return <OpenAI />;

    case 'tts':
      return <TTS />;

    default:
      return <OpenAI />;
  }
}

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: secondary[500]},
  title: {
    textAlign: 'center',
    color: '#fff',
  },
  desc: {
    textAlign: 'center',
    color: '#fff',
  },
  illustationImage: {
    height: '60%',
    width: width * 0.95,
    resizeMode: 'contain',
  },
  slideWrapper: {alignItems: 'center', width},
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
});
