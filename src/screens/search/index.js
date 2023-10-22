import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Voice from '@react-native-community/voice';
import {apiCall} from '../../api';
import Tts from 'react-native-tts';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontsize} from '../../constants/fontsize';
import {grey, primary2, secondary} from '../../constants/color';
import Message from './message';
import voice from '../../assets/voice.png';
import voiceGif from '../../assets/recording.gif';
import Toast from '../../commonComponents.js/toast';
import Bot from '../../assets/images/bot.png';
import AddKeyModal from './AddKeyModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// let key = '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';
let key = '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';

export default function Search(props) {
  const [messages, setMessages] = useState([
    {content: 'Hi👋🏻, how can I help you?', role: 'assistant'},
  ]);
  const [isRecording, setIsRecordig] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const flatlistRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const ref = useRef();
  const [apiKey, setApiKey] = useState('');

  const handleBackButton = () => {
    BackHandler.exitApp();
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, []);
  console.log('apiKey', apiKey);

  useEffect(() => {
    async function checkApiKey() {
      const api_key = await AsyncStorage.getItem('api_key');
      setApiKey(api_key ?? key);
    }
    checkApiKey();
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechError;

    Tts.addEventListener('tts-start', event => {
      setIsSpeaking(true);
    });
    Tts.addEventListener('tts-finish', event => {
      setIsSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  const onSpeechStartHandler = () => {
    setIsRecordig(true);
  };
  const onSpeechEndHandler = () => {
    setIsRecordig(false);
  };

  const onSpeechResultsHandler = e => {
    console.log(e.value);
    setResult(e.value[0]);
  };

  useEffect(() => {
    if (Platform.OS === 'android' && result !== '') {
      stopRecoding();
    }
  }, [result]);

  const onSpeechError = e => {
    setIsRecordig(false);
    if (e.error.message.includes('7/No match')) {
      ref.current.toast('Unable to recognize your voice');
    } else if (
      e.error.message.includes('9/Insufficient permissions') ||
      e.error.message.includes('User denied access to speech recognition')
    ) {
      const microphoneAccess =
        Platform.OS === 'ios' ? 'Speech recognition' : 'Microphone';

      ref.current.toast(
        `${microphoneAccess} access was denied, Go to app-settings and enable the ${microphoneAccess} access`,
      );
      setTimeout(() => {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
      }, 3000);
    } else {
      ref.current.toast(e.error.message);
    }
    console.log('onSpeechError', e);
  };

  // const stopRecoding = async msg => {
  //   try {
  //     setIsRecordig(false);
  //     await Voice.stop();
  //     await Voice.destroy().then(Voice.removeAllListeners);
  //     await getAiResponse([...msg]);
  //   } catch (e) {
  //     console.log('stopRecoding', e);
  //   }
  // };

  const stopRecoding = async () => {
    try {
      setIsRecordig(false);
      await Voice.stop();
      await Voice.destroy().then(Voice.removeAllListeners);
      await getAiResponse();
    } catch (e) {
      console.log('stopRecoding', e);
    }
  };

  const startRecoarding = async () => {
    setResult('');
    setIsRecordig(true);
    setIsSpeaking(false);
    Tts.stop();
    try {
      await Voice.start('en-GB');
    } catch (e) {
      console.log('startRecoarding', e);
    }
  };

  const getAiResponse = async => {
    if (result.trim().length > 0) {
      let newMsg = [...messages];
      newMsg.push({role: 'user', content: result.trim()});
      setMessages([...newMsg]);
      setIsLoading(true);
      apiCall(result.trim(), newMsg, apiKey)
        .then(res => {
          setIsLoading(false);

          if (res.success) {
            setMessages([...res.data]);
            startSpeech(res.data[res.data.length - 1]);
          } else {
            console.log('ereder', res);
            if (res.msg) {
              let error = res.msg;
              if (res.msg.includes('401')) {
                error = 'API key expired or invalid, Click on `Add new Key`';
              } else if (res.msg.includes('Network Error')) {
                error = 'Please check your internet connection';
              } else {
                error = 'Request failed, Please try again later';
              }
              ref.current.toast(error);
            }
          }
        })
        .catch(error => {
          console.log('err', error);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Tts.speak('', {
        iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
        rate: 0.5,
      });
    } else {
      Tts.getInitStatus().then(
        () => {
          Tts.speak('', {
            iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
            rate: 0.5,
          });
        },
        err => {
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
        },
      );
    }
  }, [messages.length]);

  const startSpeech = msg => {
    if (!msg?.content.startsWith('https') && msg?.role === 'assistant') {
      Tts.speak(msg.content, {
        iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
        rate: 0.5,
      });
    }
    console.log('msg', msg);
  };
  const stopSpeaking = () => {
    Tts.stop();
    setIsSpeaking(false);
  };

  const handleModalCallback = async keyValue => {
    if (keyValue?.length > 0) {
      await AsyncStorage.setItem('api_key', keyValue);
      setApiKey(keyValue);
    }
    setShowAddKeyModal(false);
  };

  return (
    <SafeAreaView style={[style.wrapper, {backgroundColor: secondary[500]}]}>
      <Toast ref={ref} />
      <StatusBar backgroundColor={secondary[500]} barStyle={'light-content'} />
      <View style={style.header}>
        <Image source={Bot} style={style.botImage} resizeMode={'contain'} />
        <TouchableOpacity onPress={() => setShowAddKeyModal(prev => !prev)}>
          <Text style={{color: grey[300], fontSize: fontsize.medium}}>
            Add New Key
          </Text>
        </TouchableOpacity>
      </View>

      <View style={style.wrapper}>
        <FlatList
          ref={flatlistRef}
          onContentSizeChange={() => flatlistRef.current?.scrollToEnd()}
          data={messages}
          renderItem={({item}) => <Message mes={item} />}
          ListFooterComponent={
            isLoading && (
              <View style={{marginVertical: responsiveScreenHeight(1)}}>
                <ActivityIndicator size={'large'} color={primary2[900]} />
              </View>
            )
          }
        />
      </View>

      <View style={style.flexRowSpaceArround}>
        <View style={style.CTAView}>
          {messages.length > 1 && (
            <LinearGradient
              colors={[secondary[300], secondary[400]]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={style.borderRadius}>
              <TouchableOpacity onPress={() => setMessages([])}>
                <Text style={style.CTA}>Clear</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
        <View style={[style.CTAView, style.with50]}>
          {!isRecording && (
            <TouchableOpacity
              onPress={startRecoarding}
              style={style.horizontalCenter}>
              <Image source={voice} style={style.gifImage} resizeMode="cover" />
              <Text style={[style.CTA]}>Tap to speak</Text>
            </TouchableOpacity>
          )}

          {isRecording && (
            <TouchableOpacity
              onPress={stopRecoding}
              style={style.horizontalCenter}>
              <Image
                source={voiceGif}
                style={style.gifImage}
                resizeMode="cover"
              />
              <Text style={style.CTA}>Tap to stop</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={style.CTAView}>
          {isSpeaking && (
            <LinearGradient
              colors={[primary2[700], primary2[800], primary2[900]]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={style.borderRadius}>
              <TouchableOpacity onPress={stopSpeaking}>
                <Text style={style.CTA}>Stop</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      </View>
      {showAddKeyModal && (
        <AddKeyModal
          {...props}
          handleModalCallback={handleModalCallback}
          apiKey={apiKey}
        />
      )}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  imageView: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: responsiveScreenHeight(0.75),
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
    marginVertical: responsiveScreenHeight(0.75),
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
  wrapper: {
    flex: 1,
  },
  flexRowSpaceArround: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: responsiveScreenHeight(1),
  },
  gifImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  userText: {
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
  },
  assistantText: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  CTAView: {width: '25%', alignItems: 'center'},
  CTA: {
    fontSize: fontsize.extraSmall,
    color: grey[200],
    marginVertical: responsiveScreenHeight(1),
    marginHorizontal: responsiveScreenWidth(4),
  },
  horizontalCenter: {
    alignItems: 'center',
  },
  borderRadius: {
    borderRadius: 20,
  },
  with50: {
    width: '50%',
  },
  botImage: {
    width: 60,
    height: 60,
    marginRight: 'auto',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: responsiveScreenWidth(2),
    marginBottom: responsiveScreenHeight(1),
  },
});
