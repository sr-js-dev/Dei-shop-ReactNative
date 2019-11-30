import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  InteractionManager,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import _ from 'lodash';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Touchable from 'react-native-platform-touchable';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents, FlatList } from 'react-navigation';
import axios from 'axios';
import API from '../../components/API';
import { STCartGridItem, AXIOS_CONFIG, DEIMediumText } from '../../components';
import AppSessionManager from '../../components/AppSessionManager';
import Grid from '../../components/EasyGrid';
import { StorageKeys } from '../../config';
import { Colors, ApplicationStyles, Images, Fonts } from '../../themes';
import SectionTitle from '../../components/SectionTitle';
import RoundedImageWithTitle from '../../components/RoundedImageWithTitle';
import CartBadge from '../../components/CartBadge';

class StoreDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const store = navigation.getParam('Store');
    return {
      title: store.name,
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={ApplicationStyles.navigation.tabIconContainer}>
          <Image
            style={ApplicationStyles.navigation.actionImage}
            source={Images.cart.icon}
          />
          <CartBadge style={{position: 'absolute', left: 15, top: 10}}/>
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);

    var storeInfo = this.props.navigation.getParam('Store', {});

    this.state = {
      products: [],
      category_ids: [],
      categories: [],
      isLoading: false,
      store: storeInfo,
      storeReadMore: {},
      currentPage: 1,
      loadingMore: false,
      refreshing: false
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchProducts();
      this.fetchMerchantDetail();
    });
  }

  fetchMerchantDetail = () => {
    const { store } = this.state;
    const merchantId = store.id;

    const url = API.StoreDetail(merchantId);
    var headers = AppSessionManager.shared().getAuthorizationHeader();
    axios
      .get(url, headers, AXIOS_CONFIG)
      .then(response => {
        this.setState({storeReadMore: response.data})
        // console.log('================', response.data)
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };

  fetchProducts = () => {
    if (Object.keys(this.state.store).length < 1) {
      return;
    }
    if (this.state.currentPage == 1) {
      this.setState({ products: [], isLoading: true });
    } else {
      this.setState({ isLoading: false, loadingMore: true });
    }
    var storeId = this.state.store.company_id; // 233
    if (this.state.store.id != null) {
      storeId = this.state.store.id;
    }
    const api = API.StoreProducts(storeId) + '?items_per_page=30&page=' + this.state.currentPage;
    console.log(api);

    var headers = AppSessionManager.shared().getAuthorizationHeader();
    axios
      .get(api, headers, AXIOS_CONFIG)
      .then(response => {
        console.log(response);
        //this.setState({ sLoading: false });
        if (response.status == 200) {
          const data = response.data;
          // TODO: check this again if the api response changed
          const Header = data.Header[0];
          let categoryIds = [];
          if (Header.category_ids != null) {
            categoryIds = Header.category_ids.split(',');
          }
          this.setState({ category_ids: categoryIds }, this.getCategories);
          const products = data.Products;
          if (Array.isArray(products) && products.length) {
            var productsList = this.state.products;
            if (this.state.currentPage == 1) {
              productsList = products;
            } else {
              productsList = productsList.concat(products);
            }
            this.setState({
              products: productsList,
              isLoading: false,
              loadingMore: false
            });
            console.log(productsList);
          } else {
            this.setState({
              currentPage: currentPage - 1,
              isLoading: false,
              loadingMore: false
            });
          }
        }
      })
      .catch(err => {
        this.setState({ isLoading: false, loadingMore: false });
      });
  };

  getCategories = async () => {
    const { category_ids } = this.state;
    let categories = await AsyncStorage.getItem(StorageKeys.Categories);
    categories = JSON.parse(categories);
    categories = _.filter(categories, item => {
      if (_.includes(category_ids, item.id.toString())) return item;
    });
    this.setState({ categories });
  };
  onRefresh = () => {};

  onEndReached = () => {
    const { currentPage, isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ currentPage: currentPage + 1 }, this.fetchProducts);
  };

  renderHeader = () => {
    const { store, categories } = this.state;
    const { banner_url } = store;
    return (
      <View>
        <Image source={{ uri: banner_url }} style={styles.banner} />
        <TouchableOpacity style={styles.timeWrapper} onPress={this.showStoreReadMore}>
          <Text style={styles.readMore}>Read More</Text>
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TouchableOpacity style={styles.roundedSearch}>
            <React.Fragment>
              <FeatherIcon name="search" color={'#B7B7B7'} size={20} />
              <DEIMediumText
                title="SEARCH SHOP OR PRODUCT"
                style={{ color: '#B7B7B7', marginLeft: 20 }}
              />
            </React.Fragment>
          </TouchableOpacity>
        </View>
        <SectionTitle title="CATEGORIES" showAll />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 10
          }}
          data={categories}
          renderItem={this.renderCategory}
        />
      </View>
    );
  };

  renderCategory = ({ item, index }) => {
    return (
      <RoundedImageWithTitle
        onPress={item => alert('category clicked')}
        data={item}
        title={item.name}
        imageUrl={item.image_url}
      />
    );
  };

  showStoreReadMore = item => {
    this.props.navigation.navigate('StoreReadMore', {
      ReadmoreData: this.state.storeReadMore
    });
    // this.props.navigation.navigate('HomeProductDetail', {
    //   ProductId: item.product_id,
    //   count: item.quantity,
    //   product: item
    // });
  };

  showProductDetail = item => {
    // this.props.navigation.navigate('HomeProductDetail', {
    //   ProductId: product.product_id
    // });
    this.props.navigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };

  checkCartProducts() {
    if (AppSessionManager.shared().isCartChanged == true) {
      AppSessionManager.shared().isCartChanged = false;
      var cartitems = AppSessionManager.shared().getOrders();
      var products = this.state.products;
      for (let [i, cartItem] of cartitems.entries()) {
        console.log(cartItem);
        for (let [i, product] of products.entries()) {
          if (product.product_id == cartItem.product_id) {
            if (
              Array.isArray(cartItem.options) &&
              cartItem.options.length > 0
            ) {
            } else {
              products[i].quantity = cartItem.quantity;
              products[i].options = cartItem.options;
            }
          }
        }
      }
      this.setState({ products: products });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.checkCartProducts();
          }}
        />
        <Spinner visible={this.state.isLoading} />
        <Grid
          numColumns={3}
          ListHeaderComponent={this.renderHeader()}
          data={this.state.products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={store => (
            <STCartGridItem item={store.item} action={this.showProductDetail} />
          )}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          onEndReached={() => this.onEndReached()}
          loadingMore={this.state.loadingMore}
          marginExternal={10}
          marginInternal={10}
        />
      </View>
    );
  }
}

export default StoreDetail;

const styles = StyleSheet.create({
  banner: { width: '100%', height: 150, resizeMode: 'cover' },
  timeWrapper: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  clockContainer: { flexDirection: 'row', alignItems: 'center' },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.darkGrey
  },
  roundedSearch: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  readMore: {
    ...Fonts.style.normal,
    color: Colors.white
  }
});
