import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  StatusBar,
  ScrollView
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  StoreBanner,
  isNetworkConnected,
  AXIOS_CONFIG,
  ShowAlert,
  DEIMediumText
} from './../../components/index';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';
import AppSessionManager from '../../components/AppSessionManager';
import Axios from 'axios';
import Grid from '../../components/EasyGrid';
import { NavigationEvents } from 'react-navigation';

import API from '../../components/API';
import HomeBannerList from '../../components/HomeBannerList';
import HomeSectionItem from '../../components/HomeSectionItem';
import HomeCategoryItems from '../../components/HomeCategoryItems';
import _ from 'lodash';
import { Colors, ApplicationStyles, Images } from '../../themes';
import HomeExploreInfo from '../../components/HomeExploreInfo';

const scrWidth = Dimensions.get('screen').width;

export class HomePage extends Component {
  static navigationOptions = {
    headerTitle: (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={Images.logo}
          style={{
            height: 35,
            width: 35,
            resizeMode: 'contain',
            tintColor: Colors.headerTint
          }}
        />
      </View>
    ),
    headerLeft: null,
    headerRight: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      home: {},
      activeSlide: 0,
      banners: [],
      sections: [],
      categories: []
    };
  }

  componentDidMount() {
    this.updateDisplay()
  }

  updateDisplay = () => {
    const { home } = this.props
    if (home != null) {
      var bannerList = [];
      if (Array.isArray(home.banner)) {
        bannerList = home.banner;
      }

      var sectionList = [];
      if (Array.isArray(home.sections)) {
        sectionList = home.sections;
      }

      var categoryList = [];
      if (Array.isArray(home.categories)) {
        categoryList = home.categories;
        // TODO: remove this later
        AppSessionManager.shared().updateCategoriesList(categoryList);
      }
      this.setState({
        isLoading: false,
        home,
        banners: bannerList,
        sections: sectionList,
        categories: categoryList
      });
    }
  };


  storeBannerItemClicked = item => {
    console.log(item);
    this.props.navigation.navigate('StoreDetail', { Store: item });
  };

  renderBanners = () => {
    const { banners, activeSlide } = this.state;
    if (banners.length > 0) {
      return (
        <View
          style={{
            height: 180,
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Carousel
            layout={'default'}
            removeClippedSubviews={false}
            ref={c => {
              this._carousel = c;
            }}
            data={banners}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.storeBannerItemClicked(item)}
                style={{ alignItems: 'center' }}
              >
                <StoreBanner item={item} mWidth={scrWidth} mHeight={220} />
              </TouchableOpacity>
            )}
            sliderWidth={scrWidth}
            itemWidth={scrWidth}
            onSnapToItem={index => this.setState({ activeSlide: index })}
          />
          <View style={{ position: 'absolute', bottom: -20 }}>
            <Pagination
              dotsLength={banners.length}
              activeDotIndex={activeSlide}
              containerStyle={{
                height: 20,
                width: 20
              }}
              dotStyle={{
                width: 7,
                height: 7,
                borderRadius: 5,
                marginHorizontal: 4,
                borderWidth: StyleSheet.hairlineWidth,
                backgroundColor: Colors.white
              }}
              inactiveDotStyle={{
                backgroundColor: Colors.darkGrey
              }}
              inactiveDotOpacity={1.0}
              inactiveDotScale={1.0}
            />
          </View>
        </View>
      );
    }
  };

  categoryClicked = item => {
    this.props.navigation.navigate('HomeStoreCategories', {
      selectedCategory: item
    });
  };

  renderCategories = () => {
    return (
      <View style={{ marginHorizontal: 10, marginTop: 20, margin: 'auto' }}>
        <HomeCategoryItems
          items={this.state.categories}
          onClick={this.categoryClicked}
        />
      </View>
    );
  };

  bannerUrlClicked = item => {
    console.log(item);
    if (item != null && Object.keys(item).length > 0) {
      if (item.object_type == 'url') {
        this.props.navigation.navigate('HomeBannerUrlPage', {
          url: item.object_url,
          title_name: ''
        });
      } else if (item.object_type == 'category') {
        this.props.navigation.navigate('HomeBannerCategoryList', {
          categoryId: item.object_id,
          categoryName: item.name
        });
      }
    }
  };

  resetSectionProductQuantityCount = sections => {
    console.log(sections);
  };

  refreshCartProduct = () => {
    var sections = this.state.sections;
    if (sections.length < 1) {
      return;
    }
    //  debugger;
    if (
      AppSessionManager.shared().isHomeChanged == true ||
      AppSessionManager.shared().isCartChanged == true
    ) {
      AppSessionManager.shared().isHomeChanged = false;
      AppSessionManager.shared().isCartChanged == false;
      var cartitems = AppSessionManager.shared().getOrders();
      console.log('refresh cart items');
      console.log(cartitems);
      if (cartitems.length < 1) {
        this.resetSectionProductQuantityCount(sections);
      } else {
        console.log(sections);
        var updatedSections = [];
        for (const sectionInfo of sections) {
          var updateSectionItem = sectionInfo;
          const products = sectionInfo['products'];
          var productsList = [];
          if (Array.isArray(products)) {
            for (const item of products) {
              var productItem = item;
              productItem.quantity = 0;
              for (const cartitem of cartitems) {
                if (cartitem.product_id == productItem.product_id) {
                  productItem.quantity = cartitem.quantity;
                  console.log('match found');
                  break;
                }
              }
              productsList.push(productItem);
            }
            updateSectionItem['products'] = productsList;
          }
          updatedSections.push(updateSectionItem);
        }
        this.setState({ sections: updatedSections });
      }
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={Colors.darkPrimary}
          barStyle="light-content"
        />
        <NavigationEvents
          onWillFocus={payload => {
            this.refreshCartProduct();
          }}
        />
        <Spinner visible={isLoading} />
        <ScrollView>
          <View>
            <HomeExploreInfo experience_id={this.props.user.experience_id} />
            {this.renderBanners()}
            <View style={styles.searchWrapper}>
              <TouchableOpacity
                style={styles.searchBarViewStyle}
                onPress={() =>
                  this.props.navigation.navigate('HomeCategorySearch')
                }
              >
                <FeatherIcon name="search" color={'#B7B7B7'} size={20} />
                <DEIMediumText
                  title="SEARCH SHOP OR PRODUCT"
                  style={{ color: '#B7B7B7', flex: 1, marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={{
                marginTop: 10
              }}
              data={this.state.sections}
              extraDat={this.state}
              keyExtractor={(item, index) => `section_${index}`}
              renderItem={({ item, index }) => (
                <HomeSectionItem
                  item={item}
                  index={index}
                  urlClicked={this.bannerUrlClicked}
                  homeNavigation={this.props.navigation}
                />
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchWrapper: { backgroundColor: Colors.accent, padding: 10 },
  searchBarViewStyle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#fff',
    borderColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    ...ApplicationStyles.shadow.normal
  }
});

const mapStateToProps = ({ configuration, auth }) => ({
  home: configuration.home,
  user: auth.user || {}
})
export default connect(mapStateToProps)(HomePage);
