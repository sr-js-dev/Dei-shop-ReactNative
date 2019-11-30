import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import { connect } from 'react-redux' 
import AuthActions from '../../redux/AuthRedux'
import { DEIMediumText, resetUserInfo, getUserInfo } from '../../components';

class MySettings extends Component {
  static navigationOptions = {
    title: 'Settings'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  logoutAction = () => {
    this.props.logout()
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={{ backgroundColor: '#fff' }}>
          <TouchableOpacity
            onPress={this.logoutAction}
            style={{
              height: 60,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 20
            }}
          >
            <DEIMediumText title={'Logout'} style={{ fontSize: 15 }} />
            <Image
              source={require('../../assets/Cart/ic_cart_dis.png')}
              style={{ width: 6, height: 12 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(AuthActions.logout())
})
export default connect(null, mapDispatchToProps)(MySettings);
