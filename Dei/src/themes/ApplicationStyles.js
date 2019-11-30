import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  navigation: {
    actionImage: {
      marginRight: 15,
      width: 20,
      height: 19,
      tintColor: Colors.headerTint
    },
    badgeContainer: {
      position: 'absolute',
      right: -8,
      top: -4,
      backgroundColor: '#FF8960',
      borderRadius: 8,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    badgeText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: Fonts.type.base
    },
    tabIcon: { width: 23, height: 23, resizeMode: 'contain' },
    tabIconContainer: {height: Metrics.navBarHeight, alignItems: 'center', justifyContent: 'center'}
  },
  screen: {
    wrapper: {
      flex: 1,
      backgroundColor: Colors.primary
    }
  },
  shadow: {
    normal: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5
    }
  }
};

export default ApplicationStyles;
