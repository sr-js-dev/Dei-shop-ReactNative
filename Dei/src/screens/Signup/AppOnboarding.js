import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Image
} from 'react-native';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';

import { DEIMediumText } from '../../components';
import Swiper from 'react-native-swiper';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import { savePushToken } from './../../components/Auth';
import ImageLoad from 'react-native-image-placeholder';
import { StorageKeys } from '../../config';
import { Colors, Fonts, Metrics, Images } from '../../themes';

const ImageSeparator = () => (
  <View
    style={{
      height: 20,
      flexDirection: 'row',
      width: Metrics.screenWidth
    }}
  >
    <View style={{ height: 20, flex: 1, backgroundColor: Colors.primary }} />
    <View
      style={{ height: 20, flex: 1, backgroundColor: Colors.darkPrimary }}
    />
  </View>
);

class AppOnboarding extends Component {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      onboarding: [],
      activeIndex: 0,
      isLoading: false
    };
    OneSignal.init('bb4c1454-d50c-4177-96bb-70b7039d53a0'); //91e8224d-c5ed-4f54-b2ca-9d170a18b072

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure(); // triggers the ids event
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
    // debugger;
    if (device.pushToken != null) {
      savePushToken(device.pushToken);
    }
    // {pushToken: "fHjoUSN3JSk:APA91bHMX003j9UEw8O2bL-Fl29kdGuXt__ma1…C2mAzKeE1cr7nb4nufbDEiKE4e6nLo7by3B6-E5ss-9uCEjGx", userId: "9e3e5ab4-9d21-45fa-bde7-1442d81481a5"}pushToken: "fHjoUSN3JSk:APA91bHMX003j9UEw8O2bL-Fl29kdGuXt__ma1mMMaqvf0WB-b4UF32PL-hEV9CHp6OainEaCHA6n16fFYpMewFF13gC2mAzKeE1cr7nb4nufbDEiKE4e6nLo7by3B6-E5ss-9uCEjGx"
    // userId: "9e3e5ab4-9d21-45fa-bde7-1442d81481a5"__proto__: Object
  }

  async componentDidMount() {
    if (this.props.onboarding != null) {
      this.setState({
        onboarding: this.props.onboarding
      });
    } else {
      this.updateDefaultOnboarding();
    }
  }

  updateDefaultOnboarding() {
    this.setState({ isLoading: false });
    var item = {
      title: 'Mollit esse minima ',
      description: 'Cupiditate quia repr'
    };

    this.setState({ onboarding: [item], isLoading: false });
  }

  renderPageView(item) {
    const { activeIndex } = this.state;
    const {
      descStyle,
      continueViewStyle,
      titleStyle,
      imagePlaceholder
    } = styles;

    const { title, description, image } = item;
    return (
      <View style={{ flex: 1 }} key={title}>
        <ImageLoad
          style={{ width: '100%', height: '60%' }}
          placeholderSource={Images.onboarding}
          source={{ uri: image }}
          isShowActivity={false}
          customImagePlaceholderDefaultStyle={imagePlaceholder}
        />
        <ImageSeparator />

        <View style={{ alignItems: 'center', flex: 1, paddingTop: 10 }}>
          <View style={styles.titleContainer}>
            <Text style={titleStyle}>{title.toUpperCase()}</Text>
            <Image source={Images.dottedSquare} style={styles.dotted} />
          </View>

          <Text style={descStyle}>{description}</Text>
          {activeIndex === this.state.onboarding.length - 1 && (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
              style={continueViewStyle}
            >
              <DEIMediumText
                title={'Continue'}
                style={{
                  color: '#fff',
                  marginHorizontal: 20
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={Colors.darkPrimary}
          barStyle="light-content"
        />
        <Spinner visible={this.state.isLoading} />
        <Swiper
          key={this.state.onboarding.length}
          showsButtons={false}
          dot={<View style={styles.inActiveDotStyle} />}
          activeDot={<View style={styles.activeDotStyle} />}
          onIndexChanged={index => this.setState({ activeIndex: index })}
          loop={false}
        >
          {this.state.onboarding.map((item, i) => {
            return this.renderPageView(item);
          })}
        </Swiper>
      </View>
    );
  }
}

const dotDimension = 16;
const dotMargin = 10;
const styles = StyleSheet.create({
  inActiveDotStyle: {
    backgroundColor: Colors.inactiveDot,
    width: dotDimension,
    height: dotDimension,
    borderRadius: dotDimension / 2,
    marginHorizontal: dotMargin
  },
  activeDotStyle: {
    backgroundColor: Colors.activeDot,
    width: dotDimension,
    height: dotDimension,
    borderRadius: dotDimension / 2,
    marginHorizontal: dotMargin
  },
  imagePlaceholder: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%'
  },
  viewStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '30%'
  },
  continueViewStyle: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    marginTop: 15
  },
  dotted: {
    width: 60,
    height: 60,
    position: 'relative',
    left: -30,
    zIndex: -10
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleStyle: {
    color: Colors.darkPrimary,
    fontSize: 30,
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: Fonts.type.bold
  },
  descStyle: {
    color: '#1E233D',
    fontSize: 14,
    margin: 10,
    marginHorizontal: 25,
    textAlign: 'center',
    fontFamily: Fonts.type.base
  }
});

const mapStateToProps = ({ configuration }) => ({
  onboarding: configuration.onboarding
})
export default connect(mapStateToProps)(AppOnboarding);
