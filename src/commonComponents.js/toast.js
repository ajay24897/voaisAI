import {View, Text, StyleSheet} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {commonColors, secondary} from '../constants/color';
import {fontsize} from '../constants/fontsize';

const Toast = forwardRef((props, ref) => {
  const [showTost, setShowToast] = useState(false);
  const [toastMes, setToastMes] = useState('');

  useEffect(() => {
    let timer;
    if (showTost) {
      setTimeout(() => {
        setShowToast(false);
        setToastMes('');
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [showTost]);

  useImperativeHandle(ref, () => ({
    toast(mes) {
      console.log(mes);
      setToastMes(mes);
      setShowToast(true);
    },
  }));
  return (
    showTost && (
      <View style={style.conatiner}>
        <View style={[style.contentConatiner]}>
          <Text style={style.message}>{toastMes}</Text>
        </View>
      </View>
    )
  );
});

const style = StyleSheet.create({
  conatiner: {
    position: 'absolute',
    bottom: 150,
    zIndex: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentConatiner: {
    backgroundColor: secondary[400],
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: 100,
  },
  message: {
    fontSize: fontsize.small,
    color: commonColors.white,
    textAlign: 'center',
  },
});

export default Toast;
