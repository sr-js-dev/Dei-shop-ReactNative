import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import {
  SgButton,
  SgTextField,
  isNetworkConnected
} from './../../components/index';
import axios from 'axios';
import API from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';
import AppSessionManager from '../../components/AppSessionManager';

export class ChangePassword extends Component {
  static navigationOptions = {
    title: 'Change Password'
  };

  constructor(props) {
    super(props);
    this.state = {
      currentpassword: '',
      password: '',
      confirmpassword: '',
      isLoading: false
    };
  }

  textChanged = (text, placeholder) => {
    if (placeholder == 'Enter New Password') this.setState({ password: text });
    else if (placeholder == 'Enter Current Password')
      this.setState({ currentpassword: text });
    else this.setState({ confirmpassword: text });
    // const isPassword =
    //   placeholder == 'Enter New Password'
    //     ? this.setState({ password: text })
    //     : this.setState({ confirmpassword: text });
  };

  submitAction = () => {
    const { currentpassword, password, confirmpassword } = this.state;

    if (password.length < 1) {
      alert('Please enter your Password');
      return;
    } else if (confirmpassword.length < 1) {
      alert('Please enter your Confirm Password');
      return;
    } else if (confirmpassword != password) {
      alert('Confirm new Password should be same as the password entered');
      return;
    } else if (currentpassword.length < 1) {
      alert('Please enter your Current Password');
      return;
    }
    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      if (status) {
        this.setState({ isLoading: true });
        var params = {
          current_password: currentpassword,
          password: password
        };
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        axios
          .put(API.ChangePassword, params, headers)
          .then(response => {
            this.setState({ isLoading: false });
            if (response.status == 200) {
              const data = response.data;
              console.log(data);
              if (data != null) {
                this.setState({ isLoading: false });
                setTimeout(() => {
                  Alert.alert(
                    'Info',
                    'Password changed Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => {
                          this.props.navigation.goBack();
                        }
                      }
                    ],
                    { cancelable: true }
                  );
                }, 200);
              }
            }
          })
          .catch(err => {
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert('Failed to update password');
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

  render() {
    const { currentpassword, password, confirmpassword } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <View style={{ marginHorizontal: 20, marginTop: 50 }}>
          <SgTextField
            placeholder={'Enter Current Password'}
            action={this.textChanged}
            value={currentpassword}
          />
          <View style={{ height: 20 }} />
          <SgTextField
            placeholder={'Enter New Password'}
            action={this.textChanged}
            value={password}
          />
          <View style={{ height: 20 }} />
          <SgTextField
            placeholder={'Confirm New Password'}
            action={this.textChanged}
            value={confirmpassword}
          />
          <View
            style={{
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: '30%'
            }}
          >
            <SgButton title={'Submit'} action={this.submitAction} />
          </View>
        </View>
      </View>
    );
  }
}

export default ChangePassword;
