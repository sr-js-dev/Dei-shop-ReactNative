import React, { Component } from 'react';
import { View, Alert, StyleSheet, Image, Platform } from 'react-native';
import {
  AXIOS_CONFIG,
  saveUserTokenInfo,
  DEIRegularText
} from './../../components/index';
import { connect } from 'react-redux'
import api, { NoInternetAlert, isNetworkConnected } from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';
import Touchable from 'react-native-platform-touchable';
import axios from 'axios';
import AppSessionManager from '../../components/AppSessionManager';
import { Images, ApplicationStyles, Colors, Fonts } from '../../themes';
import { ScrollView } from 'react-native-gesture-handler';
import { Input, ThemeProvider, Text, Button } from 'react-native-elements';
import { SocialButton } from './Register';
import { loginWithFacebook } from './LoginFB';
import AuthActions from '../../redux/AuthRedux'

export const RNELoginTheme = {
  Input: {
    containerStyle: {
      borderRadius: 30,
      borderWidth: 1,
      borderColor: Colors.darkGrey,
      marginTop: 30,
      backgroundColor: Colors.white,
      ...ApplicationStyles.shadow.normal
    },
    inputContainerStyle: {
      borderBottomWidth: 0
    },
    inputStyle: {
      fontFamily: Fonts.type.base,
      fontSize: Fonts.size.input,
      marginHorizontal: 15,
      color: Colors.black
    },
    placeholderTextColor: Colors.darkGrey,
    underlineColorAndroid: 'transparent'
  },
  Button: {
    buttonStyle: {
      backgroundColor: Colors.accent,
      borderRadius: 10,
      alignSelf: 'center',
      paddingHorizontal: 30,
      paddingVertical: 10,
      marginTop: 20
    },
    titleStyle: { fontFamily: Fonts.type.base, fontSize: 14 }
  },
  CheckBox: {
    checkedColor: Colors.accent,
    containerStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      margin: 0,
      marginVertical: 10,
      marginTop: 25
    },
    titleProps: {
      style: {
        fontFamily: Fonts.type.base,
        color: Colors.darkerGrey,
        marginLeft: 8
      }
    }
  }
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.posting && !nextProps.posting && !nextProps.error) {
    
      if (nextProps.user != null && nextProps.token != null) {
        console.tron.error('token not null')
          var userInfo = {
            token: nextProps.token,
            User: nextProps.user
          };
          AppSessionManager.shared().updateSessionToken(nextProps.token);
          saveUserTokenInfo(userInfo);
        if (
          nextProps.user.experience_id == null ||
          nextProps.user.experience_id === 0
        ) {
          this.props.navigation.navigate('Explore');
        } else {
          this.props.navigation.navigate('Home');
        }
      }
      
    }
  }

  forgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  ShowAlert = msg => {
    Alert.alert(
      '',
      msg,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: true }
    );
  };

  loginAPI(params) {
    isNetworkConnected().then(status => {
      if (status == true) {
        this.setState({ isLoading: true });

        var message = 'Login Failed - Please try again with valid credentials';
        console.log(api.Login);
        axios
          .post(api.Login, params, AXIOS_CONFIG)
          .then(response => {
            this.setState({ isLoading: false });
            console.log(response);
            if (response.status == 200) {
              const data = response.data;
              console.log(data);
              if (data != null) {
                var userInfo = {
                  token: data.Token,
                  User: data.User
                };
                if (data.Token != null && data.Token.length > 0) {
                  AppSessionManager.shared().updateSessionToken(data.Token);
                }
                saveUserTokenInfo(userInfo);
              }

              setTimeout(() => {
                // TODO: you need to switch the condition if you want to test the explore screen
                if (
                  data.User.experience_id == null ||
                  data.User.experience_id === 0
                ) {
                  this.props.navigation.navigate('Explore');
                } else {
                  this.props.navigation.navigate('Home');
                }
              }, 100);
            } else {
              this.setState({ isLoading: false });
              setTimeout(() => {
                this.ShowAlert(message);
              }, 100);
            }
          })
          .catch(err => {
            const data = err.response.data;
            console.log(err.response);
            if (data != null) {
              const errorMessage = data.alert.message;
              if (errorMessage != null && errorMessage.length > 0) {
                message = errorMessage;
              }
            }
            this.setState({ isLoading: false });
            setTimeout(() => {
              console.log(err.response);
              this.ShowAlert(message);
            }, 200);
          });
      } else {
        NoInternetAlert();
      }
    });
  }

  signinAction = () => {
    const { username, password } = this.state;
    //  alert(this.state.username + ' ' + this.state.password);
    //this.props.navigation.navigate('StoreHome');
    if (username.length < 1) {
      this.ShowAlert('Please enter valid Email Id');
      return;
      // return;
    } else if (password.length < 1) {
      this.ShowAlert('Please enter valid Password');
      return;
    }

    const params = {
      email: username,
      password: password
    };

    this.props.loginRequest(params);
  };

  signupAction = () => {
    this.props.navigation.navigate('Register', {
      isEditProfile: false,
      title_name: 'Create Account'
    });
  };

  loginFBAction = () => {
    loginWithFacebook()
      .then(params => {
        this.props.loginRequest(params);
      })
      .catch(err => {
        debugger;
        console.log(err);
        if (err.reason == 'Cancelled') {
          return;
        }
        alert('Unable to Login - Please try later');
      });
  };
  render() {
    const { posting } = this.props
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <View style={styles.wrapper}>
          <Spinner visible={posting} />
          <ScrollView>
            <Image source={Images.logo} style={styles.logo} />
            <View style={styles.formContainer}>
              <Text style={styles.title}>Sign in to your account</Text>
              <Input
                placeholder="EMAIL"
                keyboardType={'email-address'}
                onChangeText={username => this.setState({ username })}
                value={this.state.username}
              />
              <Input
                placeholder="PASSWORD"
                secureTextEntry
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                returnKeyType={'done'}
              />
              <Touchable style={styles.forgot} onPress={this.forgotPassword}>
                <Text style={styles.forgotText}>Forgot your Password?</Text>
              </Touchable>

              <Button title="SIGN IN" onPress={this.signinAction} />

              <Touchable style={styles.footer} onPress={this.signupAction}>
                <Text style={styles.forgotText}>
                  Don't have an account?{' '}
                  <Text style={{ color: Colors.accent }}>Create</Text>
                </Text>
              </Touchable>
              <View
                style={{
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <DEIRegularText
                  title={'Or signin using social media'}
                  style={{ color: Colors.darkerGrey, fontSize: 17 }}
                />
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <SocialButton
                    type={'FB'}
                    action={() => this.loginFBAction()}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ThemeProvider>
    );
  }
}



const mapStateToProps = ({ auth }) => ({
  posting: auth.posting,
  error: auth.error,
  user: auth.user,
  token: auth.token
})

const mapDispatchToProps = (dispatch) => ({
  loginRequest: form => dispatch(AuthActions.loginRequest(form))
})
export default connect(mapStateToProps, mapDispatchToProps)(Login);


const logoWidth = 200;
const styles = StyleSheet.create({
  wrapper: {
    ...ApplicationStyles.screen.wrapper,
    paddingTop: Platform.select({
      ios: 40
    })
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
    fontSize: Fonts.size.h4
  },
  forgot: {
    alignSelf: 'flex-end',
    marginVertical: 20
  },
  forgotText: {
    fontFamily: Fonts.type.bold,
    color: Colors.darkGrey
  },
  footer: {
    alignSelf: 'center',
    marginVertical: 20,
    marginBottom: 0
  }
});