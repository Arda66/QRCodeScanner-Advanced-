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
import ThemedListItem from 'react-native-elements/dist/list/ListItem';

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
      scanHistoryVisible: false,
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
          <View style={{flexDirection: 'row',}}>
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
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  ScanHistory = () =>{
    return (
    <Modal
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      animationType="fade"
      transparent={false}
      visible={this.state.scanHistoryVisible}
      onRequestClose={() => {
        ToastAndroid.show('Registry has been closed.', ToastAndroid.SHORT);
        this.setState({scanHistoryVisible:false})
      }}>




      <FlatList
      data={this.TemporaryArray}
      renderItem={({item}) =>{
        return(
          <View style={{justifyContent:'center',flex:1,alignItems:'center', top: '25%', margin:10,}}>
          <Text style={{borderWidth: 1, color:'black',borderRadius:2, padding: 5,}}>{item}</Text>
          <TouchableOpacity
          onPress
          >

          </TouchableOpacity>
          </View>
        );
      }}
      />




      <TouchableOpacity
        style={{
          backgroundColor: 'powderblue',
          borderRadius: 20,
          width: 100,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: '35%',
          top: '85%',
        }}
        onPress={() => this.setState({scanHistoryVisible:false})}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Close</Text>
      </TouchableOpacity>
    </Modal>
  );}


  FlashEnabler = () => {
    this.setState({flash: RNCamera.Constants.FlashMode.torch});
    ToastAndroid.show('Flash is Enabled!', 1);
  };


  EnterManualPressed = () => {
    ToastAndroid.show('Please enter barcode manually', 0, 5);
    this.setState({modalVisible: true});
  };
  UpdateHistory = (arrayitem) =>{

  }

  onSuccess = e => {
    if (this.TemporaryArray.includes(e.data))
      console.warn('This barcode/QRCode is already scanned!');
    else {
      this.TemporaryArray.push(e.data);
      this.UpdateHistory(e);
      console.warn(e.data);
        Linking.openURL(e.data).catch(err =>
        console.error('An error occured', err),
      );
    }
  };

  ApplyButtonPressed = (text, setText) => {
    if (text == null) console.warn('Barcode number can not be null!');
    else if (this.TemporaryArray.includes(text))
      console.warn('This barcode is already scanned and added!');
    else {
      this.setState({modalVisible: false});
      this.TemporaryArray.push(text);
      console.log(this.TemporaryArray);
      this.UpdateHistory(text);
        ToastAndroid.show(
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
                  right: '35%',
                }}
                onPress={() => this.EnterManualPressed()}>
                <Text style={{fontWeight: 'bold', color: 'black'}}>Enter</Text>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  manually
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
            style={{
              backgroundColor: 'red',
              borderRadius: 20,
              width: 80,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: '20%',
              right: '2%',
            }}
            onPress={() =>  this.setState({scanHistoryVisible: true})}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>Scan History</Text>
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
            <this.ScanHistory/>
          </View>
        }
        bottomContent={
          <View
            style={styles.BottomContainer}
            RefreshControl={
              <RefreshControl
                refreshing={this.state.refresh}
                
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

         
          </View>
        }></QRCodeScanner>
    );
  }
}


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
