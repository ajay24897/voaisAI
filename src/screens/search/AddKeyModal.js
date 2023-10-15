import {
  View,
  Text,
  Modal,
  StyleSheet,
  Linking,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {grey, primary2, secondary} from '../../constants/color';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontsize} from '../../constants/fontsize';

const AddKeyModal = props => {
  const {handleModalCallback} = props;
  const [apiKey, setApiKey] = useState('');

  console.log('apiKey', apiKey);
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={style.container}>
        <View style={style.contentContainer}>
          <View style={{marginHorizontal: responsiveScreenWidth(4)}}>
            <Text style={style.headerText}>Add OpenAI API key</Text>

            <Text style={{color: grey[300]}}>
              API keys are unique identifiers that are used to authenticate and
              authorize access to a specific API.An API key is required to use
              the OpenAI API, which allows to access the functionality and data
              of the OpenAI platform.{'\n'}
              {'\n'}
              Click on below link and generate key
            </Text>

            <Text
              style={style.linkText}
              onPress={() =>
                Linking.openURL('https://platform.openai.com/account/api-keys')
              }>
              https://platform.openai.com/account/api-keys
            </Text>

            <Text style={{color: grey[300]}}>
              {'\n'}
              Once Api key get's genrated, add key below and Submit
            </Text>

            <TextInput
              style={style.input}
              placeholderTextColor={grey[100]}
              value={apiKey}
              onChangeText={text => setApiKey(text)}
              placeholder="Add Api key here"
            />
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
              onPress={() => handleModalCallback(apiKey)}>
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
    minWidth: '30%',
    maxWidth: '80%',
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
  CTAView: {flexDirection: 'row', justifyContent: 'space-evenly'},
});
