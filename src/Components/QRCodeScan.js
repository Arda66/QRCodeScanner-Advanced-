import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  AppRegistry,
  Linking,
  Button,
  Modal,
  RefreshControl,
  ToastAndroid,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  FlatList,
} from 'react-native'; /* rnc yazınca react native otomatik template oluşturuyor bizim için , rnfe function component export yapıyor*/
import React, {Component, useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

/* import {AirbnbRating} from 'react-native-elements';
 */ ('use strict');

export default class QRCodeScan extends Component {
  //  sendData = () => {
  //   this.props.parentCallBack(this.TemporaryArray);
  // };

  constructor(props) {
    /* Usestate equivalent in class component */
    super(props);
    this.state = {
      navigation:
        '' /* We set prop value default so we can use to navigate in onpress  function later  */,
      flash: RNCamera.Constants.FlashMode.off,
      refresh: false,
      modalVisible: false,
    };
  }

  /*  RefreshController = () => {
    const [Refreshing, SetRefreshing] = useState(false);
  }; */
  TemporaryArray = [];
  EnterManuallyPopUp = () => {
    const [text, SetText] = React.useState(null);

    return (
      <Modal
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          ToastAndroid.show(
            'Manual entering has been closed.',
            ToastAndroid.SHORT,
          );
          SetText(null);
          this.setState({modalVisible: false});
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            keyboardAppearance="light"
            onChangeText={text => SetText(text)}
            value={text}
            placeholder="Enter barcode number manually."
            placeholderTextColor={'green'}
            color="white"
            keyboardType="default"
            numberOfLines={1}
          />

          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              borderRadius: 20,
              width: 70,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.ApplyButtonPressed(text, SetText)}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>Apply</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  RegistryList = () => {
    return (
      <FlatList
        data={this.TemporaryArray}
        renderItem={({arrayitem}) => {
          this.props.navigation.navigate('MainMenuScreen', {
            params: {
              arrayitem: this.TemporaryArray,
            },
          });
          <Text style={{borderWidth: 1, borderColor: 'black'}}>
            {arrayitem}
          </Text>;
        }}></FlatList>
    );
  };
  FlashEnabler = () => {
    this.setState({flash: RNCamera.Constants.FlashMode.torch});
    ToastAndroid.show('Flash is Enabled!', 1);
  };

  /* SendDataToMainMenu = ({navigation}) => {
    navigation.navigate('MainMenuScreen', {arrayitems: this.TemporaryArray});
    console.log(this.TemporaryArray);
  }; */

  onSuccess = e => {
    if (this.TemporaryArray.includes(e.data))
      console.warn('This barcode/QRCode is already scanned!');
    else {
      this.TemporaryArray.push(e.data);
      console.warn(e.data);
      /*       this.SendDataToMainMenu();
       */ Linking.openURL(e.data).catch(err =>
        console.error('An error occured', err),
      );
    }
  };
  EnterManualPressed = () => {
    ToastAndroid.show('Please enter barcode manually', 0, 5);
    this.setState({modalVisible: true});
  };
  ApplyButtonPressed = (text, setText) => {
    if (text == null) console.warn('Barcode number can not be null!');
    else if (this.TemporaryArray.includes(text))
      console.warn('This barcode is already scanned and added!');
    else {
      this.setState({modalVisible: false});
      this.TemporaryArray.push(text);
      console.log(this.TemporaryArray);
      this.RegistryList();
      /*       this.SendDataToMainMenu();
       */ ToastAndroid.show(
        'Barcode number added registry successfully! (' + text + ')',
        1,
      );
      setText(null);
    }
  };

  render() {
    return (
      <QRCodeScanner
        reactivate={false}
        customMarker={
          <TouchableOpacity
            style={{width: 200, height: 200}}></TouchableOpacity>
        }
        styles={{flex: 1}}
        onRead={this.onSuccess}
        flashMode={this.state.flash}
        topContent={
          <View style={styles.TopContainer}>
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text style={[styles.centerText, styles.textBold]}>
                Scan QR Code and Barcode, it detects automatically.
              </Text>
              <this.EnterManuallyPopUp />
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 50,
                  backgroundColor: 'green',
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: '20%',
                  right: '25%',
                }}
                onPress={() => this.EnterManualPressed()}>
                <Text style={{fontWeight: 'bold', color: 'black'}}>Enter</Text>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  manually
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => this.FlashEnabler()}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{width: 70, height: 70, bottom: '20%'}}
                source={require('../images/flashDefault.png')}
              />
            </TouchableOpacity>
            {/* <this.RegistryList/> */}
          </View>
        }
        bottomContent={
          <View
            style={styles.BottomContainer}
            RefreshControl={
              <RefreshControl
                refreshing={this.state.refresh}
                /*                 onRefresh={this.setState({refresh: true})}
                 */
              />
            }>
            <TouchableOpacity
              style={styles.Button}
              onPress={() => this.props.navigation.navigate('RateUsScreen')}>
              <Text style={styles.Text}>Rate us!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.Button]}
              onPress={() =>
                this.props.navigation.navigate('GiveUsFeedBackScreen')
              }>
              <Text style={styles.Text}>Give us a feedback!</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.buttonTouchable}>
            <AirbnbRating
              count={5}
              defaultRating={1}
              reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
              showRating
            />
          </TouchableOpacity> */}
          </View>
        }></QRCodeScanner>
    );
  }
}
/* const RateuspressHandler = () => {
  return <RateUsPopUpScreen style={{visible: true}} />;
};

const RateUsPopUpScreen = () => {
  return (
    <Modal visible={false} transparent={true}>
      <Text styles={{centerText}}>Hello</Text>
    </Modal>
  );
};
const GiveUsFeedBackScreen = () => {
  return <Modal visible={false}></Modal>;
}; */

const styles = StyleSheet.create({
  centerText: {
    fontSize: 17,
    marginLeft: '1%',
    color: '#777',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
  },
  textBold: {
    flex: 1,
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
    flex: 1,
  },
  BottomContainer: {
    flexDirection: 'row',
    marginTop: 70,
    flex: 1,
    alignItems: 'center',
  },
  Button: {
    width: 100,
    height: 50,
    backgroundColor: '#33ccff',
    marginHorizontal: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text: {
    fontWeight: 'bold',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TopContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    height: '8%',
    margin: '5%',
    width: '70%',
    borderWidth: 2,
    padding: 5,
    borderColor: 'blue',
    borderRadius: 15,
  },
});

AppRegistry.registerComponent('default', () => QRCodeScan);
