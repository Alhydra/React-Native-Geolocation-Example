import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
  state= {
    location:null,
    geocode:null,
    errorMessage:""
  }
  componentDidMount(){
    this.getLocationAsync()
  }
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation});
    const { latitude , longitude } = location.coords
    this.getGeocodeAsync({latitude, longitude})
    this.setState({ location: {latitude, longitude}});

  };
  getGeocodeAsync= async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location)
    this.setState({ geocode})
  }
  render(){
    const {location,geocode, errorMessage } = this.state
    return (
      <ImageBackground  source={require("./assets/bg.jpg")} blurRadius={5} style={styles.container}>
        <View style={styles.overlay}>
          <Image source={require("./assets/marker.png")} style={{width:100,height:100}} />
          <Text style={styles.heading1}>{geocode  ? `${geocode[0].city}, ${geocode[0].isoCountryCode}` :""}</Text>
          <Text style={styles.heading2}>{geocode ? geocode[0].street :""}</Text>
          <Text style={styles.heading3}>{location ? `${location.latitude}, ${location.longitude}` :""}</Text>
          <Text style={styles.heading2}>{errorMessage}</Text>

        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  overlay:{
    backgroundColor:"#00000070",
    height:"100%",
    width:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
  heading1:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:30,
    margin:20
  },
  heading2:{
    color:"#fff",
    margin:5,
    fontWeight:"bold",
    fontSize:15
  },
  heading3:{
    color:"#fff",
    margin:5
  }
});
