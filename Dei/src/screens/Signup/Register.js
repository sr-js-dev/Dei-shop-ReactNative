import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  SgButton,
  SgTextField,
  SgProfilePic,
  DEIMediumText,
  DEIRegularText,
  isNetworkConnected,
  saveUserTokenInfo,
  AXIOS_CONFIG
} from './../../components/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-navigation';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';
import {
  ThemeProvider,
  Input,
  Button,
  Text,
  CheckBox
} from 'react-native-elements';
import { RNELoginTheme } from './Login';
import { ApplicationStyles, Colors, Fonts, Images } from '../../themes';

import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';
import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';
import Axios from 'axios';
import { loginWithFacebook } from './LoginFB';

class Register extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title_name')
    };
  };

  constructor(props) {
    super(props);
    var isEditProfile = false;
    if (this.props.navigation.state.params.isEditProfile == true) {
      isEditProfile = true;
    }
    var firstname = '';
    var lastname = '';
    var email = '';
    var mobileno = '';
    var photo_url = null;
    if (this.props.navigation.state.params.user != null) {
      const user = this.props.navigation.state.params.user;
      if (user.first_name != null) {
        firstname = user.first_name;
      }
      if (user.last_name != null) {
        lastname = user.last_name;
      }
      if (user.email != null) {
        email = user.email;
      }
      if (user.mobile != null) {
        mobileno = user.mobile;
      }
      if (user.photo_url != null) {
        photo_url = user.photo_url.length > 0 ? user.photo_url : null;
      }
    }

    // this.state = {
    //   firstname: 'test',
    //   lastname: 'test',
    //   email: 'testdei3@gmail.com',
    //   mobileno: '123456789',
    //   password: 'test1234',
    //   fbId: '',
    //   fbAccessToken: '',
    //   fbPicUrl: '',
    //   isLoading: false,
    //   photo: ''
    // };

    this.state = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobileno: mobileno,
      password: '',
      fbId: '',
      fbAccessToken: '',
      fbPicUrl: '',
      isLoading: false,
      photo: '',
      isEditProfile: isEditProfile,
      photo_url: photo_url,
      isAccept: false
    };

    this.textChanged = this.textChanged.bind(this);
  }

  updateFBDisplayData = user => {
    if (Object.keys(user).length > 0) {
      const email = user.email;
      const fname = user.first_name;
      const lname = user.last_name;
      const fbId = user.id;
      this.setState({ email: email, firstname: fname, lastname: lname });
      //  https://graph.facebook.com/2206733672715571/picture?type=large
    }
  };

  loginAPI(params) {
    isNetworkConnected().then(status => {
      if (status == true) {
        this.setState({ isLoading: true });

        var message = 'Login Failed - Please try again with valid credentials';
        axios
          .post(API.Login, params, AXIOS_CONFIG)
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

  fbClicked = () => {
    loginWithFacebook()
      .then(fbInfo => {
        console.log('success');
        console.log(fbInfo);
        this.loginAPI(fbInfo);
        // this.updateFBDisplayData(user);
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  textChanged = (text, placeholder) => {
    switch (placeholder) {
      case 'First Name':
        this.setState({ firstname: text });
        break;
      case 'Last Name':
        this.setState({ lastname: text });
        break;
      case 'Email Address':
        this.setState({ email: text });
        break;
      case 'Mobile Number':
        this.setState({ mobileno: text });
        break;
      case 'Password':
        this.setState({ password: text });
        break;
      default:
        break;
    }
  };

  signinAction = () => {
    const {
      firstname,
      lastname,
      mobileno,
      password,
      email,
      photo,
      isEditProfile,
      isAccept
    } = this.state;

    if (firstname.length < 1) {
      alert('Please enter your First Name');
      return;
    } else if (email.length < 1) {
      alert('Please enter valid Email Id');
      return;
    } else if (mobileno.length < 1) {
      alert('Please enter your Mobile Number');
      return;
    } else if (password.length < 1) {
      alert('Please enter your Password');
      return;
    }

    if (!isEditProfile && !isAccept) {
      alert('You have to accept all Terms and Conditions');
      return;
    }

    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      if (status) {
        this.setState({ isLoading: true });
        console.log(API.Register);
        var params = {
          first_name: firstname,
          last_name: lastname,
          email: email,
          mobile: mobileno,
          password: password,
          photo: photo
        };
        console.log(params);
        axios
          .post(API.Register, params, AXIOS_CONFIG)
          .then(response => {
            this.setState({ isLoading: false });
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
            }
          })
          .catch(err => {
            console.log(err.response);
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert('Email Id - Already Exists');
            }, 200);
            console.log('Error ' + err);
            console.log('Error ' + err.response);
          });
      } else {
        alert(
          'No Internet connection found.Check your connection or try again.'
        );
      }
    });
  };

  updateProfileAction = () => {
    const {
      firstname,
      lastname,
      mobileno,
      password,
      email,
      photo,
      isAccept,
      isEditProfile
    } = this.state;

    if (firstname.length < 1) {
      alert('Please enter your First Name');
      return;
    } else if (email.length < 1) {
      alert('Please enter valid Email Id');
      return;
    } else if (mobileno.length < 1) {
      alert('The mobile must be between 7 and 12 digits');
      return;
    }

    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      if (status) {
        this.setState({ isLoading: true });
        console.log(API.ProfileUpdate);
        var params = {
          first_name: firstname,
          last_name: lastname,
          mobile: mobileno,
          photo: photo
        };

        console.log(params);
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        console.log(headers);
        axios
          .put(API.ProfileUpdate, params, headers)
          .then(response => {
            this.setState({ isLoading: false });
            if (response.status == 200) {
              const data = response.data;
              console.log(data);
              if (data != null) {
                AppSessionManager.shared().isProfileUpdated = true;
                setTimeout(() => {
                  Alert.alert('Info', 'Profile Updated Successfully', [
                    {
                      text: 'Ok',
                      onPress: () => {
                        this.props.navigation.goBack();
                      }
                    }
                  ]);
                }, 200);
              }
            }
          })
          .catch(err => {
            console.log(err.response);
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert('Failed to update profile');
            }, 200);
            console.log('Error ' + err);
            console.log('Error ' + err.response);
          });
      } else {
        alert(
          'No Internet connection found.Check your connection or try again.'
        );
      }
    });
  };

  photoCaptured = source => {
    if (source.uri.length > 0) {
      console.log(source.uri);
      this.setState({ photo: source.uri });
    }
  };

  renderSignupFooter() {
    return (
      <View
        style={{
          marginTop: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <DEIRegularText
          title={'Or create account using social media'}
          style={{ color: Colors.darkerGrey, fontSize: 17 }}
        />
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <SocialButton type={'FB'} action={this.fbClicked} />
        </View>
      </View>
    );
  }

  renderEditProfileFooter() {
    return (
      <View
        style={{
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Terms')}
        >
          <DEIRegularText
            title={'Terms and Conditions'}
            style={{
              color: '#9393A7',
              fontSize: 17,
              textDecorationLine: 'underline'
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { isEditProfile } = this.state;
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <View style={styles.wrapper}>
          <Spinner visible={this.state.isLoading} />
          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={{ justifyContent: 'center' }}>
              <View style={styles.formContainer}>
                <View>
                  <SgProfilePic
                    action={this.photoCaptured}
                    sourceURL={this.state.photo_url}
                  />
                </View>
                <View style={{ height: 50 }} />
                <Input
                  placeholder="FIRST NAME"
                  onChangeText={firstname => this.setState({ firstname })}
                  value={this.state.firstname}
                />
                <Input
                  placeholder="LAST NAME"
                  onChangeText={lastname => this.setState({ lastname })}
                  value={this.state.lastname}
                />
                <Input
                  placeholder="EMAIL ADDRESS"
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                  keyboardType="email-address"
                />
                <Input
                  placeholder="MOBILE NO"
                  onChangeText={mobileno => this.setState({ mobileno })}
                  value={this.state.mobileno}
                  keyboardType="phone-pad"
                />

                {!isEditProfile && (
                  <Input
                    placeholder="PASSWORD"
                    secureTextEntry
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                    returnKeyType={'done'}
                  />
                )}
                {!isEditProfile && (
                  <CheckBox
                    title="I accept all Terms and Conditions"
                    checked={this.state.isAccept}
                    onPress={() =>
                      this.setState({ isAccept: !this.state.isAccept })
                    }
                  />
                )}
                <Button
                  title={isEditProfile ? 'UPDATE' : 'REGISTER'}
                  onPress={() => {
                    isEditProfile
                      ? this.updateProfileAction()
                      : this.signinAction();
                  }}
                />

                <View style={{ alignItems: 'center' }}>
                  {!this.state.isEditProfile && this.renderSignupFooter()}
                  {this.state.isEditProfile && this.renderEditProfileFooter()}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ThemeProvider>
    );
  }
}

export const SocialButton = ({ type, action }) => {
  const icon = type == 'FB' ? Images.social.facebook : Images.social.twitter;
  return (
    <TouchableOpacity onPress={action} style={{ marginHorizontal: 10 }}>
      <Image source={icon} style={{ width: 30, height: 30 }} />
    </TouchableOpacity>
  );
};

export default Register;

// export function loginFB() {
//   return new Promise((resolve, reject) => {
//     LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
//       function(result) {
//         console.log(result);
//         if (result.isCancelled) {
//           reject({ reason: 'Cancelled' });
//         } else {
//           AccessToken.getCurrentAccessToken().then(data => {
//             console.log(data);
//             const token = data.accessToken.toString();
//             const fbInfo = {
//               email: '',
//               password: '',
//               social_type: 'Facebook',
//               social_id: data.userID,
//               social_token: data.accessToken.toString()
//             };
//             debugger;
//             console.log(fbInfo);
//             //   resolve(fbInfo);

//             fetch(
//               'https://graph.facebook.com/v3.0/me?fields=name,first_name,last_name,gender,email,verified,link&access_token=' +
//                 token
//             )
//               .then(response => response.json())
//               .then(user => {
//                 console.log(user);
//                 resolve(fbInfo);
//               })
//               .catch(err => {
//                 reject({ reason: 'Error' });
//               });
//           });
//         }
//       },
//       function(error) {
//         debugger;
//         console.log(error);
//         reject({ reason: 'Error' });
//       }
//     );
//   });
// }

const styles = StyleSheet.create({
  wrapper: {
    ...ApplicationStyles.screen.wrapper
  },
  formContainer: {
    margin: 15,
    marginTop: 90,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.white
  }
});
