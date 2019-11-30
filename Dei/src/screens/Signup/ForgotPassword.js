import React, { Component } from 'react';
import { View, Platform, StyleSheet, ScrollView, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { ThemeProvider, Input, Button, Text } from 'react-native-elements';

import axios from 'axios';
import API from '../../components/API';
import { RNELoginTheme } from './Login';
import { ShowAlert, isNetworkConnected, AXIOS_CONFIG } from '../../components';
import { ApplicationStyles, Colors, Fonts, Images } from '../../themes';

export class ForgotPassword extends Component {
  static navigationOptions = {
    title: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isLoading: false
    };
  }

  submitClicked = () => {
    if (this.state.email.length < 1) {
      ShowAlert('Please enter valid email');
      return;
    }

    this.setState({ isLoading: true });

    isNetworkConnected().then(status => {
      if (status == true) {
        const params = {
          email: this.state.email
        };
        axios
          .post(API.ForgotPassword, params, AXIOS_CONFIG)
          .then(response => {
            this.setState({ isLoading: false });
            const data = response.data;
            if (data.status == 'error') {
              ShowAlert(data.message ? data.message : 'Invalid Email Address');
            } else {
              var code = data.code ? data.code : '';
              this.props.navigation.navigate('VerifyForgotPassword', {
                email: this.state.email,
                code: code
              });
            }
          })
          .catch(err => {
            const data = err.response.data;
            console.log(err.response);
          });
      } else {
        NoInternetAlert();
      }
    });
  };

  verifyCodeClicked = () => {
    this.props.navigation.navigate('VerifyForgotPassword', {
      email: this.state.email,
      code: ''
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
              <Text style={styles.title}>Forgot Your Password?</Text>
              <Text style={styles.subtitle}>
                Enter the email address associated with your account
              </Text>
              <Text style={styles.message}>
                We will email you a link to reset your password
              </Text>
              <Input
                placeholder="EMAIL"
                keyboardType={'email-address'}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                returnKeyType="done"
              />

              <Button title="SEND EMAIL" onPress={this.submitClicked} />
            </View>
          </ScrollView>
        </View>
      </ThemeProvider>
    );
  }
}

export default ForgotPassword;

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
