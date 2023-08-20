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
  ToastAndroid,
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

export default function Search() {
  const [messages, setMessages] = useState(dummyRes);
  const [isRecording, setIsRecordig] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const flatlistRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const onSpeechStartHandler = () => {
    setIsRecordig(true);
  };
  const onSpeechEndHandler = () => {
    setIsRecordig(false);
  };

  const onSpeechResultsHandler = e => {
    setResult(e.value[0]);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      stopRecoding();
    }
  }, [result]);

  const onSpeechError = e => {
    setIsRecordig(false);
    if (e.error.message) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(e.error.message, 1500);
      }
    }
    console.log('onSpeechError', e);
  };

  const stopRecoding = async () => {
    try {
      setIsRecordig(false);
      await Voice.stop();
      getAiResponse();
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

  const getAiResponse = () => {
    if (result.trim().length > 0) {
      let newMsg = [...messages];
      newMsg.push({role: 'user', content: result.trim()});
      setMessages([...newMsg]);
      setIsLoading(true);
      console.log('result.trim()', result.trim());
      apiCall(result.trim(), newMsg)
        .then(res => {
          setIsLoading(false);

          if (res.success) {
            setMessages([...res.data]);
            startSpeech(res.data[res.data.length - 1]);
          } else {
            if (res.msg) {
              if (Platform.OS === 'android') {
                ToastAndroid.show(res.msg, 1500);
              }
            }
          }
        })
        .catch(() => setIsLoading(false));
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

  return (
    <SafeAreaView style={[style.wrapper, {backgroundColor: secondary[500]}]}>
      <StatusBar backgroundColor={secondary[500]} />
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
          {!!messages.length && (
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
          {!isSpeaking && (
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
    paddingVertical: responsiveScreenHeight(1),
  },
  gifImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    overlayColor: 'rgb(25,30,40)',
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
});

const dummyRes = [{content: 'Hi👋🏻, how can I help you?', role: 'assistant'}];

// const dummyRes = [
//   {content: 'how many legs do cow have', role: 'user'},
//   {content: 'A cow has four legs.', role: 'assistant'},
//   {content: 'best place to visit in Mumbai', role: 'user'},
//   {content: 'image of cow', role: 'user'},
//   {
//     content:
//       'https://oaidalleapiprodscus.blob.core.windows.net/private/org-O9DYCkYkwKEHhVKBHibYkIs8/user-xTE8gDGvaoLkCMd4JvX3jH5z/img-GfwmQYhB08Beja757FgoFgEN.png?st=2023-08-05T16%3A24%3A07Z&se=2023-08-05T18%3A24%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-08-05T11%3A46%3A32Z&ske=2023-08-06T11%3A46%3A32Z&sks=b&skv=2021-08-06&sig=cY7GBt59NbkBqJHsQQttAownIuShw4pl59uxaG6tLII%3D',
//     role: 'assistant',
//   },
//   {
//     content:
//       'Choosing the best Reebok shoes depends on your personal preferences, activities, and needs. Here are some popular and highly recommended Reebok shoe models 1. Reebok Nano X: These shoes are designed for cross-training and are known for their durability and versatility.2. Reebok Classic Leather: A timeless and iconic sneaker that offers both style and comfort. Its great for casual wear.3. Reebok Floatride Run: Ideal for running, these shoes provide excellent cushioning and responsiveness for a smooth and comfortable ride',

//     role: 'assistant',
//   },
//   {content: 'how many legs do cow have', role: 'user'},
//   {content: 'A cow has four legs.', role: 'assistant'},
//   {content: 'best place to visit in Mumbai', role: 'user'},
//   {content: 'image of cow', role: 'user'},
//   {
//     content:
//       'https://oaidalleapiprodscus.blob.core.windows.net/private/org-O9DYCkYkwKEHhVKBHibYkIs8/user-xTE8gDGvaoLkCMd4JvX3jH5z/img-GfwmQYhB08Beja757FgoFgEN.png?st=2023-08-05T16%3A24%3A07Z&se=2023-08-05T18%3A24%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-08-05T11%3A46%3A32Z&ske=2023-08-06T11%3A46%3A32Z&sks=b&skv=2021-08-06&sig=cY7GBt59NbkBqJHsQQttAownIuShw4pl59uxaG6tLII%3D',
//     role: 'assistant',
//   },
//   {
//     content:
//       'Choosing the best Reebok shoes depends on your personal preferences, activities, and needs. Here are some popular and highly recommended Reebok shoe models 1. Reebok Nano X: These shoes are designed for cross-training and are known for their durability and versatility.2. Reebok Classic Leather: A timeless and iconic sneaker that offers both style and comfort. Its great for casual wear.3. Reebok Floatride Run: Ideal for running, these shoes provide excellent cushioning and responsiveness for a smooth and comfortable ride',

//     role: 'assistant',
//   },
//   {content: 'how many legs do cow have', role: 'user'},
//   {content: 'A cow has four legs.', role: 'assistant'},
//   {content: 'best place to visit in Mumbai', role: 'user'},
//   {content: 'image of cow', role: 'user'},
//   {
//     content:
//       'https://oaidalleapiprodscus.blob.core.windows.net/private/org-O9DYCkYkwKEHhVKBHibYkIs8/user-xTE8gDGvaoLkCMd4JvX3jH5z/img-GfwmQYhB08Beja757FgoFgEN.png?st=2023-08-05T16%3A24%3A07Z&se=2023-08-05T18%3A24%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-08-05T11%3A46%3A32Z&ske=2023-08-06T11%3A46%3A32Z&sks=b&skv=2021-08-06&sig=cY7GBt59NbkBqJHsQQttAownIuShw4pl59uxaG6tLII%3D',
//     role: 'assistant',
//   },
//   {
//     content:
//       'Choosing the best Reebok shoes depends on your personal preferences, activities, and needs. Here are some popular and highly recommended Reebok shoe models 1. Reebok Nano X: These shoes are designed for cross-training and are known for their durability and versatility.2. Reebok Classic Leather: A timeless and iconic sneaker that offers both style and comfort. Its great for casual wear.3. Reebok Floatride Run: Ideal for running, these shoes provide excellent cushioning and responsiveness for a smooth and comfortable ride',

//     role: 'assistant',
//   },
// ];
