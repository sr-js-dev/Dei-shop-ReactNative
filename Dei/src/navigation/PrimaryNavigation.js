/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import AppSessionManager from '../components/AppSessionManager';
import SplashScreen from '../screens/Signup/Welcome';

import AppOnboardingScreen from '../screens/Signup/AppOnboarding';
import LoginScreen from '../screens/Signup/Login';
import RegisterScreen from '../screens/Signup/Register';
import ForgotPasswordScreen from '../screens/Signup/ForgotPassword';
import VerifyForgotPasswordScreen from '../screens/Signup/ForgotVerifyPassword';

import HomeScreen from '../screens/Home/Home';
import HomeNewScreen from '../screens/Home/HomePage';
import StoresListScreen from '../screens/Home/StoresList';
import StoreDetailScreen from '../screens/Home/StoreDetail';
import StoreReadMore from '../screens/Home/StoreReadMore';
import ProductDetailScreen from '../screens/Home/ProductDetail';
import ProductPreviewScreen from '../screens/Home/ProductPreview';

import CategoriesTabScreen from '../screens/Categories/CategoriesTab';
import CategoriesListScreen from '../screens/Categories/CategoriesList';
import CategoriesBannerListScreen from '../screens/Categories/CategoryBannerList';
import CategorySearchScreen from '../screens/Categories/CategorySearch';
import BannerCategoryScreen from '../screens/Home/BannerCategory';

import MyAccountScreen from '../screens/Account/MyAccount';
import MyAddressListScreen from '../screens/Account/MyAddressList';
import MyOrderScreen from '../screens/Account/MyOrders';
import MyOrderDetailScreen from '../screens/Account/MyOrderDetail';
import MySettingScreen from '../screens/Account/MySettings';
import ChangePasswordScreen from '../screens/Account/ChangePassword';

import CartListScreen from '../screens/Cart/CartList';
import AddNewCard from '../screens/Cart/AddNewCard';
import PaymentListScreen from '../screens/Account/PaymentList';
import CheckoutScreen from '../screens/Cart/Checkout';
import TermsScreen from '../screens/Account/Terms';
import Explore from '../screens/Home/Explore';
import { Colors, Images, ApplicationStyles, Fonts } from '../themes';
import CartBadge from '../components/CartBadge';

const commonDefaultNavigationOptions = {
  headerBackTitle: 'Back',
  headerStyle: {
    backgroundColor: Colors.primary,
    elevation: 0,
    borderBottomWidth: 0
  },
  headerTintColor: Colors.headerTint,
  headerTitleStyle: {
    fontFamily: Fonts.type.base,
    alignSelf: 'center',
    textAlign: "center",
    justifyContent: 'center',
    flex: 1,
  }
};

const WelcomeStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    Register: { screen: RegisterScreen },
    Onboard: { screen: AppOnboardingScreen },
    Terms: { screen: TermsScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    VerifyForgotPassword: { screen: VerifyForgotPasswordScreen }
  },
  {
    initialRouteName: 'Onboard',
    defaultNavigationOptions: commonDefaultNavigationOptions
  }
);

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeNewScreen },
    StoreList: { screen: StoresListScreen },
    StoreDetail: { screen: StoreDetailScreen },
    StoreReadMore: { screen: StoreReadMore },
    ProductDetail: { screen: ProductDetailScreen },
    HomeStoreCategories: { screen: CategoriesListScreen },
    HomeProductDetail: { screen: ProductDetailScreen },
    HomeCategorySearch: { screen: CategorySearchScreen },
    BannerCategory: { screen: BannerCategoryScreen },
    ProductPreview: { screen: ProductPreviewScreen },
    HomeBannerUrlPage: { screen: TermsScreen },
    HomeBannerCategoryList: { screen: CategoriesBannerListScreen },
    Explore: { screen: Explore }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: commonDefaultNavigationOptions,

    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      let navigationOptions = {};
      // if (
      //   routeName == 'HomeCategorySearch' ||
      //   routeName == 'HomeProductDetail' ||
      //   routeName == 'HomeStoreCategories' ||
      //   routeName == 'StoreList' ||
      //   routeName == 'StoreDetail'
      // ) {
      //   navigationOptions.tabBarVisible = false;
      // }

      if (routeName != 'Home') {
        navigationOptions.tabBarVisible = false;
      }
      return navigationOptions;
    }
  }
);

const CategoryStack = createStackNavigator(
  {
    StoreList: { screen: CategoriesTabScreen },
    HomeProductDetail: { screen: ProductDetailScreen },
    CategorySearch: { screen: CategorySearchScreen },
    ProductPreview: { screen: ProductPreviewScreen }
  },
  {
    initialRouteName: 'StoreList', // 'StoreList'
    defaultNavigationOptions: commonDefaultNavigationOptions
  }
);

CategoryStack.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (
    routeName === 'HomeProductDetail' ||
    routeName === 'CategorySearch' ||
    routeName === 'ProductPreview'
  ) {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const StoreCategoryStack = createStackNavigator({
  StoreCategoriesMain: { screen: CategoriesListScreen }
});

const MyAccountStack = createStackNavigator(
  {
    MyAccountMain: { screen: MyAccountScreen },
    MyOrders: { screen: MyOrderScreen },
    MyOrderDetail: { screen: MyOrderDetailScreen },
    SavedCards: { screen: PaymentListScreen },
    MySetting: { screen: MySettingScreen },
    ChangePassword: { screen: ChangePasswordScreen },
    AddNewCard: { screen: AddNewCard },
    MyAddressList: { screen: MyAddressListScreen },
    Terms: { screen: TermsScreen },
    Register: { screen: RegisterScreen }
  },
  {
    initialRouteName: 'MyAccountMain',
    defaultNavigationOptions: commonDefaultNavigationOptions
  }
);

MyAccountStack.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName != 'MyAccountMain') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const CartStack = createStackNavigator(
  {
    CartMain: { screen: CartListScreen },
    CheckoutMain: { screen: CheckoutScreen },
    AddNewCard: { screen: AddNewCard }
  },
  {
    initialRouteName: 'CartMain',
    defaultNavigationOptions: commonDefaultNavigationOptions
  }
);

CartStack.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};
  if (routeName == 'AddNewCard' || routeName == 'CheckoutMain') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const AppTabStack = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Categories: { screen: CategoryStack },
    Account: { screen: MyAccountStack },
    Cart: { screen: CartStack }
  },
  {
    initialRouteName: 'Categories',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        AppSessionManager.shared().setNavigation(navigation);
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          const homeIcon = focused
            ? Images.tabs.homeSelected
            : Images.tabs.home;
          return (
            <Image
              source={homeIcon}
              style={ApplicationStyles.navigation.tabIcon}
            />
          );
        } else if (routeName === 'Categories') {
          const categoryIcon = focused
            ? Images.tabs.categorySelected
            : Images.tabs.category;
          return (
            <Image
              source={categoryIcon}
              style={ApplicationStyles.navigation.tabIcon}
            />
          );
        } else if (routeName === 'Account') {
          const myAccountIcon = focused
            ? Images.tabs.accountSelected
            : Images.tabs.account;
          return (
            <Image
              source={myAccountIcon}
              style={ApplicationStyles.navigation.tabIcon}
            />
          );
        }
        const badgeCount = navigation.getParam('badgeCount', 0);
        const learnIcon = focused ? Images.tabs.cartSelected : Images.tabs.cart;

        return (
          <View style={{ width: 24, height: 24, margin: 5 }}>
            <Image
              source={learnIcon}
              style={ApplicationStyles.navigation.tabIcon}
            />
            <CartBadge />
          </View>
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: Colors.primary,
      inactiveTintColor: '#D4D4D4'
    }
  }
);

const AppSwitchStack = createSwitchNavigator(
  {
    Welcome: SplashScreen,
    Auth: WelcomeStack,
    StoreHome: AppTabStack
  },
  {
    initialRouteName: 'Welcome'
  }
);

export default createAppContainer(AppSwitchStack);
