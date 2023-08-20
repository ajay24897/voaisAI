import React from 'react';
import {Text, Modal, View} from 'react-native';

const NoInternetModal = ({isConnected}) => {
  return (
    <Modal visible={!isConnected} animationType="slide">
      <View style={{flex: 1, backgroundColor: '#f00'}}>
        <Text>NoInternetModal</Text>
      </View>
    </Modal>
  );
};

export default NoInternetModal;
