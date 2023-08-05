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
import {grey, primary, secondary} from '../../constants/color';
import Message from './message';
import voice from '../../assets/voice.png';
import voiceGif from '../../assets/recording.gif';

export default function Ai() {
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
    console.log('onSpeechError', e);
    setIsRecordig(false);
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
      apiCall(result.trim(), newMsg)
        .then(res => {
          setIsLoading(false);

          if (res.success) {
            setMessages([...res.data]);
            startSpeech(res.data[res.data.length - 1]);
          } else {
            console.log(res.msg);
          }
        })
        .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (
      !messages[messages.length - 1]?.content.startsWith('https') &&
      messages[messages.length - 1]?.role === 'assistant'
    ) {
      if (Platform.OS === 'ios') {
        Tts.speak(messages[messages.length - 1].content, {
          iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
          rate: 0.5,
        });
      } else {
        Tts.getInitStatus().then(
          () => {
            Tts.speak(messages[messages.length - 1].content, {
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
    }
  }, [messages.length]);

  const startSpeech = msg => {
    Tts.stop();
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

  const renderItem = mes => {
    if (mes.content.includes('https')) {
      return (
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
      );
    } else {
      return (
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
          <Text style={style.text}>{mes.content}</Text>
        </LinearGradient>
      );
    }
  };
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
              <ActivityIndicator size={'large'} color={primary[500]} />
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
              <Text style={style.CTA}>Tap to speak</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={style.CTAView}>
          {isSpeaking && (
            <LinearGradient
              colors={[primary[300], primary[400], primary[500]]}
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
  text: {
    marginHorizontal: responsiveScreenWidth(3),
    color: 'rgb(203,203,208)',
    marginVertical: responsiveScreenHeight(1),
    fontSize: fontsize.small,
    lineHeight: fontsize.medium,
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

const dummyRes = [
  {content: 'how many legs do cow have', role: 'user'},
  {content: 'A cow has four legs.', role: 'assistant'},
  {content: 'best place to visit in Mumbai', role: 'user'},
  {content: 'image of cow', role: 'user'},
  {
    content:
      'https://oaidalleapiprodscus.blob.core.windows.net/private/org-O9DYCkYkwKEHhVKBHibYkIs8/user-xTE8gDGvaoLkCMd4JvX3jH5z/img-GfwmQYhB08Beja757FgoFgEN.png?st=2023-08-05T16%3A24%3A07Z&se=2023-08-05T18%3A24%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-08-05T11%3A46%3A32Z&ske=2023-08-06T11%3A46%3A32Z&sks=b&skv=2021-08-06&sig=cY7GBt59NbkBqJHsQQttAownIuShw4pl59uxaG6tLII%3D',
    role: 'assistant',
  },
  {content: 'very smart Abu', role: 'user'},
  // {
  //   content:
  //     "Thank you for the compliment! However, it's worth noting that as an AI language model, I don't have physical capabilities or appearances like smartness. I'm here to assist you with any questions or information you need. Let me know how I can help!",
  //   role: 'assistant',
  // },
  // {content: 'best Reebok shoes', role: 'user'},
  // {
  //   content:
  //     'Choosing the best Reebok shoes depends on your personal preferences, activities, and needs. Here are some popular and highly recommended Reebok shoe models 1. Reebok Nano X: These shoes are designed for cross-training and are known for their durability and versatility.2. Reebok Classic Leather: A timeless and iconic sneaker that offers both style and comfort. Its great for casual wear.3. Reebok Floatride Run: Ideal for running, these shoes provide excellent cushioning and responsiveness for a smooth and comfortable ride',
  // },
];