import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  Image,
  StatusBar,
  StyleSheet,
  Text
} from 'react-native';
import { connect } from 'react-redux'
import Axios from 'axios';
import {
  getUserInfo,
  isNetworkConnected,
  AXIOS_CONFIG
} from '../../components';
import AppSessionManager from '../../components/AppSessionManager';
import API, { NoInternetAlert } from '../../components/API';
import { StorageKeys } from '../../config';
import { Images, Colors, Fonts, ApplicationStyles } from '../../themes';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      launchFetched: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.success && nextProps.success && !nextProps.error) {
      this.navigateToSpecificScreen()
    }
  }

  navigateToSpecificScreen = () => {
    const { user } = this.props
    if (user != null) {
      if (
        user.experience_id == null ||
        user.experience_id === 0
      ) {
        this.props.navigation.navigate('Explore');
      } else {
        this.props.navigation.navigate('Home');
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={Colors.darkPrimary}
          barStyle="light-content"
        />
        <Image style={styles.logo} source={Images.logoCircle} />
        <Text style={styles.title}>Daily Everything</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    ...ApplicationStyles.screen.wrapper
  },
  logo: { width: '50%', height: '35%', resizeMode: 'contain' },
  title: {
    fontFamily: Fonts.type.base,
    fontSize: 30,
    color: Colors.white
  }
});

const mapStateToProps = ({ startup, auth }) => ({
  user: auth.user,
  success: startup.success,
  error: startup.error
})
export default connect(mapStateToProps)(Welcome);
