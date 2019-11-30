import React, { Component } from 'react';
import { View, Image, ScrollView, TouchableOpacity, InteractionManager } from 'react-native';
import {
  DEIMediumText,
  SgProfilePic,
  DEIRegularText,
  AXIOS_CONFIG
} from '../../components';

import { AccountItemView } from './MyAccountComponents';
import Axios from 'axios';
import API, { isNetworkConnected } from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';
import { NavigationEvents } from 'react-navigation';
import {connect} from 'react-redux'
import AuthActions from '../../redux/AuthRedux'
import Spinner from 'react-native-loading-spinner-overlay';
import { Images, Colors, ApplicationStyles } from '../../themes';

class MyAccount extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'My Account',
    headerRight: (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Register', {
            isEditProfile: true,
            user: AppSessionManager.shared().getUserInfo(),
            title_name: 'Edit Profile'
          })
        }
      >
        <Image
          style={ApplicationStyles.navigation.actionImage}
          source={Images.editProfile}
        />
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      picture: '',
      email: '',
      address: '',
      payment: '',
      isLoading: false,
      user: {}
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getUserInfo()
    })
    
  }


  itemClicked = title => {
    var routeName = '';
    switch (title) {
      case 'Settings':
        routeName = 'MySetting';
        break;
      case 'My Orders':
        routeName = 'MyOrders';
        break;
      case 'Payment method':
        routeName = 'SavedCards';
        break;
      case 'Change password':
        routeName = 'ChangePassword';
        break;
      case 'Address':
        routeName = 'MyAddressList';
        break;
      case 'Terms & Conditions':
        routeName = 'Terms';
        break;
      default:
        break;
    }
    if (routeName.length > 0) {
      this.props.navigation.navigate(routeName);
    }
  };

  renderOrderInfo = () => {

    return (
      <View style={{ backgroundColor: '#fff' }}>
        <AccountItemView
          title={'My Orders'}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
        <AccountItemView
          title={'Payment method'}
          details={this.state.payment}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
        <AccountItemView
          title={'Settings'}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
        <AccountItemView
          title={'Terms & Conditions'}
          isDisclosure={true}
          action={this.itemClicked}
        />
        {this.renderSeperator()}
      </View>
    );
  };

  renderProfilePic = () => {
    const {user} = this.props
    let picSource = require('../../assets/Signup/ic_emptyprofile.png');
    if (user.photo_url != null && user.photo_url.length > 0) {
      picSource = { uri: user.photo_url };
    }

    return (
      <Image
        style={{
          width: 105,
          height: 105,
          borderRadius: 52.5,
          borderWidth: 0.3,
          borderColor: 'transparent'
        }}
        source={picSource}
      />
    );
  };

  renderProfileInformation = () => {
    const {user} = this.props
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            margin: 20
          }}
        >
          {this.renderProfilePic()}
          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <DEIMediumText
              title={user.first_name + ' ' + user.last_name}
              style={{ color: '#4A4A4A', fontSize: 20 }}
            />
            <DEIRegularText
              title={user.address}
              style={{
                color: '#C2C4CA',
                fontSize: 12,
                marginTop: 10,
                marginRight: 28
              }}
            />
          </View>
        </View>
        <View style={{ backgroundColor: '#f5f5f5', height: 10 }} />
      </View>
    );
  };

  renderSeperator() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#EBECED',
          width: '100%',
          marginLeft: 20
        }}
      />
    );
  }

  renderAccountInfo = () => {
    const {user} = this.props
    return (
      <View>
        <View style={{ backgroundColor: '#fff' }}>
          <DEIMediumText
            title={'ACCOUNT INFORMATIONS'}
            style={{
              color: '#262628',
              fontSize: 12,
              marginLeft: 20,
              marginTop: 10
            }}
          />
          <AccountItemView title={'Name'} details={user.first_name + ' ' + user.last_name} />
          {this.renderSeperator()}
          <AccountItemView title={'Email'} details={user.email} />
          {this.renderSeperator()}
          <AccountItemView
            title={'Address'}
            details={user.address}
            isDisclosure={true}
            action={this.itemClicked}
          />
          {this.renderSeperator()}
          <AccountItemView
            title={'Change password'}
            details={'*********'}
            isDisclosure={true}
            action={this.itemClicked}
          />
        </View>

        <View style={{ backgroundColor: '#f5f5f5', height: 20 }} />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.props.getUserInfo();
          }}
        />
        <Spinner visible={this.state.isLoading} animation={'fade'} />

        <ScrollView>
          {this.renderProfileInformation()}
          {this.renderAccountInfo()}
          {this.renderOrderInfo()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  user: auth.user || {}
})

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: () => dispatch(AuthActions.getUserInfo())
})

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
