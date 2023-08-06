const {default: LinearGradient} = require('react-native-linear-gradient');
import {grey, primary, secondary} from '../../constants/color';
import {StyleSheet, Text, Image} from 'react-native';
import {fontsize} from '../../constants/fontsize';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import React, {memo, useState} from 'react';

function Message({mes}) {
  const [showFullMsg, setShowFullMsg] = useState(false);
  return mes?.content?.includes('https') ? (
    <LinearGradient
      colors={[secondary[300], secondary[400]]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={style.imageView}>
      <Image
        source={{uri: mes.content}}
        resizeMode="contain"
        style={style.image}
        alt="image can not load"
      />
    </LinearGradient>
  ) : (
    <LinearGradient
      colors={
        mes.role === 'user'
          ? [primary[300], primary[400], primary[500]]
          : [secondary[300], secondary[400]]
      }
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[
        style.textView,
        mes.role === 'user' ? style.userText : style.assistantText,
      ]}>
      {mes.role === 'user' && <Text style={style.text}>{mes?.content}</Text>}
      {mes.content.length > 300 && mes.role === 'assistant' && (
        <Text style={style.text}>
          {showFullMsg ? mes?.content : mes?.content.slice(0, 200)}
          <Text
            onPress={() => setShowFullMsg(pre => !pre)}
            style={{color: primary[500]}}>
            {showFullMsg ? ' See less' : '...See more'}
          </Text>
        </Text>
      )}
      {mes.content.length < 300 && mes.role === 'assistant' && (
        <Text style={style.text}>{mes?.content}</Text>
      )}
    </LinearGradient>
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
});
