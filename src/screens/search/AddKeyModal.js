import {
  View,
  Text,
  Modal,
  StyleSheet,
  Linking,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {commonColors, grey, primary2, secondary} from '../../constants/color';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontsize} from '../../constants/fontsize';

const AddKeyModal = props => {
  const {handleModalCallback, apiKey: currentApiKey} = props;
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (error?.length) {
      setError('');
    }
  }, [apiKey]);

  function handleSubmit() {
    setError('');

    if (apiKey?.trim().length < 30) {
      setError('A Key value must be between 30 and 128 characters.');
    } else {
      handleModalCallback(apiKey?.trim());
    }
  }
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <KeyboardAvoidingView
        on
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={style.container} onPress={() => Keyboard.dismiss()}>
            <View style={style.contentContainer}>
              <View style={{marginHorizontal: responsiveScreenWidth(4)}}>
                <Text style={style.headerText}>Add OpenAI API key</Text>
                <Text style={{color: grey[300]}}>
                  An API key is required to use the OpenAI API, which allows to
                  access the functionality and data of the OpenAI platform.
                  {'\n'}
                  {'\n'}
                  Click{' '}
                  <Text
                    style={style.linkText}
                    onPress={() =>
                      Linking.openURL(
                        'https://platform.openai.com/account/api-keys',
                      )
                    }>
                    here
                  </Text>{' '}
                  to generate key. Once Api key get's genrated, add key below
                  and Submit.
                </Text>

                {!!currentApiKey?.length && (
                  <Text
                    style={{
                      color: grey[200],
                      fontSize: fontsize.regular,
                      marginTop: responsiveScreenHeight(0.5),
                    }}>
                    Current Key :{' '}
                  </Text>
                )}
                <Text
                  style={{color: grey[500], fontSize: fontsize.small}}
                  selectable={true}
                  numberOfLines={1}
                  ellipsizeMode="middle">
                  {currentApiKey}
                </Text>

                <TextInput
                  style={style.input}
                  placeholderTextColor={grey[100]}
                  value={apiKey}
                  onChangeText={text => setApiKey(text)}
                  placeholder="Add Api key here"
                />
                {!!error?.length && (
                  <Text style={style.errorText}>{error}</Text>
                )}
              </View>
              <View style={style.CTAView}>
                <TouchableOpacity
                  style={[
                    style.textView,
                    {
                      marginVertical: responsiveScreenHeight(2),
                      marginHorizontal: responsiveScreenWidth(2),
                    },
                  ]}
                  onPress={handleModalCallback}>
                  <LinearGradient
                    colors={[secondary[300], secondary[400]]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[style.textView]}>
                    <Text style={style.CTAtext}>Cancle</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    style.textView,
                    {
                      marginVertical: responsiveScreenHeight(2),
                      marginHorizontal: responsiveScreenWidth(2),
                    },
                  ]}
                  onPress={handleSubmit}>
                  <LinearGradient
                    colors={[primary2[700], primary2[800], primary2[900]]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[style.textView]}>
                    <Text style={style.CTAtext}>Submit </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddKeyModal;

const style = StyleSheet.create({
  headerText: {
    marginVertical: responsiveScreenHeight(2),
    alignSelf: 'center',
    color: grey[100],
    fontSize: fontsize.medium,
  },
  input: {
    backgroundColor: 'rgba(242, 242, 242, 0.38)',
    borderRadius: 10,
    marginTop: responsiveScreenHeight(1),
    color: grey[100],
    paddingHorizontal: responsiveScreenWidth(2),
    paddingVertical: responsiveScreenHeight(1),
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(242, 242, 242, 0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: secondary[500],
    borderRadius: 20,
    width: '75%',
  },
  textView: {
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 4,
    justifyContent: 'center',
    flexGrow: 1,
  },
  CTAtext: {
    marginHorizontal: responsiveScreenWidth(3),
    color: grey[200],
    marginVertical: responsiveScreenHeight(1),
    fontSize: fontsize.small,
    lineHeight: fontsize.medium,
    alignSelf: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: primary2[700],
  },
  CTAView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: responsiveScreenWidth(2),
  },
  errorText: {
    fontSize: fontsize.regular,
    color: commonColors.red,
    marginTop: responsiveScreenHeight(0.5),
  },
});
