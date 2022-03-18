import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const RateUsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>WORK IN PROGRESS!</Text>
      <Text style={{marginTop: 20, fontSize: 15, color: 'red'}}>
        (Problem : Unable to add some libraries to react-native)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
  },
});

export default RateUsScreen;
