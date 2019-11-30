import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { ThemeProvider, Input, Button, Text } from 'react-native-elements';
import {
  SgTextField,
  DEIMediumText,
  CartButton,
  ShowAlert,
  isNetworkConnected,
  AXIOS_CONFIG
} from '../../components';

import axios from 'axios';
import { NoInternetAlert } from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';
import API from '../../components/API';
import { RNELoginTheme } from './Login';
import { ApplicationStyles, Colors, Fonts, Images } from '../../themes';

export class ForgotVerifyPassword extends Component {
  static navigationOptions = {
    title: ''
  };

  constructor(props) {
    super(props);
    var email = this.props.navigation.getParam('email', '');
    var code = this.props.navigation.getParam('code', '');
    this.state = {
      email: email,
      verificationcode: code,
      password: '',
      isLoading: false
    };
  }

  successAlert(msg) {
    Alert.alert(
      'Forgot Password',
      msg,
      [{ text: 'OK', onPress: () => this.props.navigation.navigate('Login') }],
      { cancelable: false }
    );
  }
  submitClicked = () => {
    console.log('submit clicked');
    const { email, verificationcode, password } = this.state;

    if (email.length < 1) {
      alert('Please enter email');
      return;
    } else if (verificationcode.length < 1) {
      alert('Please enter verification code');
      return;
    } else if (password.length < 1) {
      alert('Please enter password');
      return;
    }

    const params = {
      email: email,
      code: verificationcode,
      password: password
    };

    this.setState({ isLoading: true });
    console.log('123123123123', response);
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        axios
          .post(API.VerifyForgotPassword, params, AXIOS_CONFIG)
          .then(response => {
            this.setState({ isLoading: false });
            const data = response.data;
            var message = 'Your password was reset succesfully';
            if (data.message != null) {
              message = data.message;
            }
            if (data.status == 'success') {
              setTimeout(() => {
                this.successAlert(message);
              }, 200);
            } else {
              setTimeout(() => {
                alert(message);
              }, 200);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        NoInternetAlert();
      }
    });
  };

  render() {
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <View style={styles.wrapper}>
          <Spinner visible={this.state.isLoading} />
          <ScrollView>
            <Image source={Images.logo} style={styles.logo} />
            <View style={styles.formContainer}>
              <Text style={styles.title}>Verify Email</Text>
              <Text style={styles.subtitle}>
                Enter verification code received on {this.state.email} and reset
                your password
              </Text>
              <Input
                placeholder="VERIFICATION CODE"
                keyboardType={'email-address'}
                onChangeText={verificationcode =>
                  this.setState({ verificationcode })
                }
                value={this.state.verificationcode}
              />
              <Input
                placeholder="PASSWORD"
                secureTextEntry
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                returnKeyType={'done'}
              />

              <Button title="SEND EMAIL" onPress={this.submitClicked} />
            </View>
          </ScrollView>
        </View>
      </ThemeProvider>
    );
  }
}

export default ForgotVerifyPassword;

const logoWidth = 200;
const styles = StyleSheet.create({
  wrapper: {
    ...ApplicationStyles.screen.wrapper
  },
  logo: {
    width: logoWidth,
    height: logoWidth,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 15
  },
  formContainer: {
    margin: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.white
  },
  title: {
    color: Colors.darkerGrey,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.h4,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.regular,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 20
  },
  message: {
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    color: Colors.darkGrey
  }
});
