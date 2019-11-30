import React, { Component } from 'react';
import { isNetworkConnected } from '../../components';
import Axios from 'axios';
import Touchable from 'react-native-platform-touchable';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import API from '../../components/API';
import { StorageKeys } from '../../config';
import AppSessionManager from '../../components/AppSessionManager';
import { SafeAreaView } from 'react-navigation';
import { Fonts } from '../../themes';

const screenWidth = Dimensions.get('window').width;
const itemHeight = 200;
const borderRadius = 20;

const MODE = {
  explore: 'explore',
  experience: 'exprience'
};

class Explore extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    explore: [],
    experience: [],
    mode: MODE.explore,
    isLoading: false
  };

  componentDidMount() {
    this.fetchExplore();
  }

  fetchExplore = async () => {
    let configuration = await AsyncStorage.getItem(StorageKeys.Configuration);
    configuration = JSON.parse(configuration);
    this.setState({
      explore: configuration.explore
    });
  };

  openExperiences = item => {
    this.setState({
      mode: MODE.experience,
      experience: item.experience
    });
  };

  updateUserExperience = experience_id => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        this.setState({ isLoading: true });
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        const body = {
          experience_id
        };
        console.log({
          url: API.Config,
          headers,
          body
        });
        Axios.post(API.Config, body, headers)
          .then(res => {
            console.log('CONFIG', res.data);
            this.props.navigation.replace('Home');
          })
          .catch(err => {
            alert(JSON.stringify(err));
            console.log('API CONFIG ERROR', JSON.stringify(err));
          });
      } else {
        alert('not connected to network');
      }
    });
  };

  renderItem = ({ item }) => {
    return (
      <Touchable
        onPress={() => {
          if (this.state.mode === MODE.explore) {
            this.openExperiences(item);
          } else {
            // TODO: Update user config
            this.updateUserExperience(item.id);
          }
        }}
      >
        <View style={styles.itemContainer}>
          <ImageBackground
            source={{ uri: item.image_url }}
            imageStyle={{ borderRadius: 20 }}
            resizeMode={'cover'}
            style={styles.imageBackground}
          >
            <View style={styles.overlay} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.name.toUpperCase()}</Text>
            </View>
          </ImageBackground>
        </View>
      </Touchable>
    );
  };
  render() {
    const { isLoading, explore, experience, mode } = this.state;
    const exploreTitle = (
      <Text style={styles.sectionTitle}>
        Where Would You {`\n`}
        Like to <Text style={{ fontWeight: 'bold' }}>Explore?</Text>
      </Text>
    );
    const experienceTitle = (
      <Text style={styles.sectionTitle}>
        What Would You {`\n`}
        Like to <Text style={{ fontWeight: 'bold' }}>Experience?</Text>
      </Text>
    );
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.sectionContainer}>
              {mode === MODE.explore ? exploreTitle : experienceTitle}
              {isLoading && (
                <ActivityIndicator style={styles.activityIndicator} />
              )}
            </View>
          }
          data={mode === MODE.explore ? explore : experience}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `explore_${index}`}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    margin: 10
  },
  sectionContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: Fonts.type.medium
  },
  itemContainer: {
    marginBottom: 10,
    minHeight: itemHeight,
    marginHorizontal: 20,
    borderRadius: borderRadius
  },
  imageBackground: {
    width: screenWidth - 40,
    height: itemHeight,
    marginBottom: 10,
    borderRadius: borderRadius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    zIndex: 0
  },
  titleContainer: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    zIndex: 20,
    width: screenWidth / 1.2
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: Fonts.type.medium
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    borderRadius: borderRadius,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});

export default Explore;
