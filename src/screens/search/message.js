const {default: LinearGradient} = require('react-native-linear-gradient');
import {grey, primary2, secondary} from '../../constants/color';
import {
  StyleSheet,
  Text,
  Animated,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {fontsize} from '../../constants/fontsize';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import React, {memo, useEffect, useState} from 'react';

function Message({mes}) {
  const [showFullMsg, setShowFullMsg] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [hasImageLoadError, setHasImageLoadError] = useState(false);

  const animation = useState(new Animated.Value(30));
  const opacity = useState(new Animated.Value(0.25));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animation[0], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity[0], {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacity[0],
        transform: [
          {
            translateY: animation[0],
          },
        ],
      }}>
      {mes?.content?.includes('https') ? (
        <LinearGradient
          colors={[secondary[300], secondary[400]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={style.imageView}>
          <ImageBackground
            onError={e => {
              setHasImageLoadError(true);
              setImageLoading(false);
            }}
            imageStyle={style.borderRadius}
            onLoad={() => setImageLoading(false)}
            source={{uri: mes.content}}
            // source={{
            //   uri: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            // }}
            resizeMode="cover"
            style={style.image}
            alt="image can not load">
            {imageLoading && <ActivityIndicator />}
            {hasImageLoadError && (
              <Text style={style.couldNotLoadText}>Image couldn't load</Text>
            )}
          </ImageBackground>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={
            mes.role === 'user'
              ? [primary2[700], primary2[800], primary2[900]]
              : [secondary[300], secondary[400]]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[
            style.textView,
            mes.role === 'user' ? style.userText : style.assistantText,
          ]}>
          {mes.role === 'user' && (
            <Text style={style.text}>{mes?.content}</Text>
          )}
          {mes.content.length > 300 && mes.role === 'assistant' && (
            <Text style={style.text}>
              {showFullMsg ? mes?.content : mes?.content.slice(0, 200)}
              <Text
                onPress={() => setShowFullMsg(pre => !pre)}
                style={{color: primary2[800]}}>
                {showFullMsg ? ' See less' : '...See more'}
              </Text>
            </Text>
          )}
          {mes.content.length < 300 && mes.role === 'assistant' && (
            <Text style={style.text}>{mes?.content}</Text>
          )}
        </LinearGradient>
      )}
    </Animated.View>
  );
}

export default memo(Message);

const style = StyleSheet.create({
  imageView: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: responsiveScreenHeight(0.5),
    marginHorizontal: responsiveScreenWidth(2),
    borderTopLeftRadius: 0,
    padding: responsiveScreenWidth(1.5),
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
  },
  image: {
    alignSelf: 'flex-start',
    height: responsiveScreenHeight(20),
    width: responsiveScreenHeight(20),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    marginVertical: responsiveScreenHeight(0.5),
    marginHorizontal: responsiveScreenWidth(2),
    borderRadius: 20,
    maxWidth: '70%',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
  },
  text: {
    marginHorizontal: responsiveScreenWidth(3),
    color: grey[200],
    marginVertical: responsiveScreenHeight(1),
    fontSize: fontsize.small,
    lineHeight: fontsize.medium,
  },
  userText: {
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
  },
  assistantText: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  borderRadius: {borderRadius: 20},
  couldNotLoadText: {textAlign: 'center', color: grey[200]},
});
