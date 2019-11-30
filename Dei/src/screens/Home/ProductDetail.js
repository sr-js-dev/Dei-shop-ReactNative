import React, { Component } from 'react';
import { View, Text, Image, FlatList, ImageBackground } from 'react-native';
import {
  DEIRegularText,
  DEIBoldText,
  getProductImage,
  isNetworkConnected,
  DEIMediumText,
  STQuantityView,
  AXIOS_CONFIG,
  SgButton
} from '../../components';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { connect } from 'react-redux'
import CartActions from '../../redux/CartRedux'
import API from '../../components/API';

import { EmptyView } from '../../components/EmptyView';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AppSessionManager from '../../components/AppSessionManager';
import VariantView from '../Cart/VariantView';
import { SafeAreaView } from 'react-navigation';
import { Colors, ApplicationStyles, Images, Metrics } from '../../themes';
import StoreProduct from '../../components/StoreProduct';
import CartBadge from '../../components/CartBadge';

class ProductDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Product Details',
    headerRight: (
      <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={ApplicationStyles.navigation.tabIconContainer}>
        <Image
          style={ApplicationStyles.navigation.actionImage}
          source={Images.cart.icon}
        />
        <CartBadge style={{position: 'absolute', left: 15, top: 10}}/>
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    var product = navigation.getParam('product', {});
    const productId = navigation.getParam('ProductId', '');
    var count = navigation.getParam('count', 0);
    if (product.length > 0) {
      if (product.options.length > 0) {
        count = 0;
        product.selectedOptions = [];
      }
    }
    //let item = AppSessionManager.shared().getProductItem(product);
    //let item = this.clearOptions(product);
    this.state = {
      productId: productId,
      product: product,
      isConnection: true,
      isLoading: false,
      quantity: count,
      options: [],
      selectedVariant: [],
      finalPrice: ''
    };
  }

  componentDidMount() {
    
    if (Object.keys(this.state.product).length > 0) {
      this.updateProductInfo();
    } else {
      this.fetchProductDetail();
    }
  }

  updateProductInfo = () => {
    if (Object.keys(this.state.product).length > 0) {
      var productInfo = Object.assign({}, this.state.product);
      const hasOptions =
        productInfo.has_options != null && productInfo.has_options == true;
      productInfo.quantity = hasOptions ? 0 : this.state.quantity;
      var optionsList = [];
      if (productInfo.options && Object.keys(productInfo.options).length > 0) {
        const options = productInfo.options;
        for (var key in options) {
          var optionDict = options[key];
          if (optionDict.status != 'A') {
            break;
          }
          var variants = [];
          if (
            optionDict.variants != null &&
            Object.keys(optionDict.variants).length > 0
          ) {
            var index = 0;
            for (const key in optionDict.variants) {
              var variantItem = optionDict.variants[key];
              variantItem.selected = index == 0 ? true : false;
              variants.push(variantItem);
              index++;
            }
          }
          optionDict['data'] = variants;
          optionsList.push(optionDict);
        }
      }

      this.updatePriceValue(optionsList);
    }
  };

  fetchProductDetail = () => {
    this.setState({ isLoading: true });
    const api = API.Product + this.state.productId + '/detail'; // 32236 30710 11706 //
    //const api = API.Product + '117888806' + '/detail';
    console.log(api);

    var header = AppSessionManager.shared().getAuthorizationHeader();
    axios
      .get(api, header, AXIOS_CONFIG)
      .then(response => {
        if (response.status == 200) {
          const data = response.data;
          var productInfo = data.Product;
          if (Object.keys(productInfo).length > 0) {
            productInfo.quantity = this.state.quantity;
            this.setState({ isLoading: false, product: productInfo }, () => {
              this.updateProductInfo();
            });
          }
        }
      })
      .catch(err => {
        console.log(err.response);
        this.setState({ isLoading: false });
      });
  }

  updatePriceValue = options => {
    var product = this.state.product;
    var priceValue = parseFloat(product.price).toFixed(2);
    var product_option_param = {};
    var cart_option_selected = [];

    for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
      let optionInfo = options[optionIndex];
      for (
        let variantIndex = 0;
        variantIndex < optionInfo.data.length;
        variantIndex++
      ) {
        const variant = optionInfo.data[variantIndex];

        if (variant.selected == true) {
          const optionId = variant.option_id;
          const variantId = variant.variant_id;
          const addedValue = Number(variant.modifier);
          if (variant.modifier_type == 'A') {
            priceValue = Number(priceValue) + Number(addedValue);
          } else if (variant.modifier_type == 'P') {
            const percentageValue =
              Number(priceValue) * (Number(addedValue) / 100);
            priceValue = Number(priceValue) + Number(percentageValue);
          } else {
            priceValue = Number(priceValue);
          }

          product_option_param[optionId] = variantId;

          cart_option_selected.push({
            title: variant.variant_name
          });
        }
      }
    }
    var optionIdString = '';
    if (Object.keys(product_option_param).length > 0) {
      for (const key in product_option_param) {
        optionIdString += product_option_param[key];
      }
    }
    product.finalPrice = 'S$' + parseFloat(priceValue).toFixed(2);
    product.finalPriceValue = parseFloat(priceValue).toFixed(2);
    product.cart_option_selected = cart_option_selected;
    product.product_option_param = product_option_param;
    product.optionIdString = optionIdString;
    console.log('S$' + parseFloat(priceValue).toFixed(2));

    this.setState({
      finalPrice: 'S$' + parseFloat(priceValue).toFixed(2),
      product: product,
      isLoading: false,
      options: options
    });

    if (product.quantity > 0) {
      AppSessionManager.shared().addItemToCart(product);
      var orders = AppSessionManager.shared().getOrders();
      console.log(orders);
    }
  };
  variantChanged = options => {
    this.updatePriceValue(options);
    // AppSessionManager.shared().updateProductOption(product);
  };

  checkInternetConnection = () => {
    return new Promise(resolve => {
      isNetworkConnected().then(status => {
        resolve(status);
      });
    });
  };

  renderNoInternetView = () => {
    return <EmptyView type={0} action={this.checkInternetConnection} />;
  };

  quantityChanged = () => {
    AppSessionManager.shared().isCartChanged = true;
  };

  renderSpinner = () => {
    return <Spinner visible={this.state.isLoading} />;
  };

  renderProductDetail = () => {
    const {
      product,
      full_description,
      price,
      purchase_price,
      selectedOptions
    } = this.state.product;
    const regex = /(<([^>]+)>)/gi;
    var fullDescText = '';
    if (full_description != null) {
      fullDescText = full_description;
    }
    const fullDesc = `${fullDescText}`.replace(regex, '');
    var priceValue = '';

    if (price != null) {
      priceValue = 'S$' + parseFloat(price).toFixed(2);
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: '80%' }}>
          <ScrollView>
            <View>
              <TouchableOpacity
                style={{backgroundColor: Colors.grey}}
                onPress={() =>
                  this.props.navigation.navigate('ProductPreview', {
                    url: getProductImage(this.state.product)
                  })
                }
              >
                <Image
                  source={{ uri: getProductImage(this.state.product) }}
                  style={{ width: Metrics.screenWidth, height: 200, resizeMode: 'contain' }}
                />
              </TouchableOpacity>
              <View style={{ marginHorizontal: 20, marginTop: 30 }}>
                <DEIBoldText
                  title={this.state.product.name}
                  style={{ fontSize: 20, color: Colors.primary }}
                />
                {fullDesc.length > 0 && (
                  <DEIRegularText
                    title={fullDesc}
                    style={{ color: '#A1A1B4', marginTop: 10 }}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'space-around'
                  }}
                >
                  <DEIMediumText
                    title={this.state.finalPrice}
                    style={{ fontSize: 20, color: Colors.accent }}
                  />
                  {this.state.finalPrice != purchase_price && (
                    <DEIRegularText
                      title={'S$' + purchase_price}
                      style={{
                        fontSize: 18,
                        color: '#A1A1B4',
                        marginHorizontal: 10,
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid'
                      }}
                    />
                  )}
                  <View style={{ width: '50%' }}>
                    <View style={{ alignSelf: 'flex-end' }}>
                      <STQuantityView
                        item={this.state.product}
                        quantityChanged={this.quantityChanged}
                        isDetail={true}
                        isVarientSelected={true}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <VariantView
              options={this.state.options}
              variantChanged={this.variantChanged}
            />
          </ScrollView>
        </View>

        <View
          style={{
            width: '100%',
            paddingHorizontal: 15,
            height: '20%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SgButton
            title={'Go To Cart'}
            action={() => {
              this.props.navigation.navigate('Cart');
            }}
          />
        </View>
      </View>
    );
  };

  variantItemClicked = (variant, index) => {
    alert('hii');
    return;
    if (index < this.state.options.length) {
      var options = this.state.options;
      var optionItem = options[index];
      var variantList = [];
      for (let index = 0; index < optionItem.variants.length; index++) {
        var item = optionItem.variants[index];
        item.selected = item.variant_id == variant.variant_id ? true : false;
        variantList.push(item);
      }
      optionItem.variants = variantList;
      options[index] = optionItem;

      var product = this.state.product;
      product.options = options;
      let productInfo = AppSessionManager.shared().updateOptions(product);
      this.setState({ options: options, product: productInfo });
      AppSessionManager.shared().addVarientOption(productInfo);
      console.log(optionItem);
    }
  }

  variantSelected = variantId => {
    var selectedVariantList = this.state.selectedVariant;
    if (selectedVariantList.length > 0) {
      var index = selectedVariantList.findIndex(
        item => item.variant_id == variant_id
      );
      return index != -1 ? true : false;
    }
    return false;
  };

  varianttest = () => {
    alert('test');
  };

  displayVariantView = variant => {
    const { selected, variant_id, variant_name } = variant;
    return (
      <TouchableOpacity
        key={variant_id}
        onPress={this.varianttest}
        style={{
          backgroundColor: selected ? '#8CA2F8' : '#fff',
          minHeight: 30,
          borderColor: '#9393A7',
          borderWidth: selected ? 0 : 1,
          borderRadius: 15,
          marginHorizontal: 6,
          justifyContent: 'center'
        }}
      >
        <DEIRegularText
          title={variant_name}
          style={{
            color: selected ? '#fff' : '#9393A7',
            marginHorizontal: 10,
            fontSize: 14
          }}
        />
      </TouchableOpacity>
    );
  };

  renderProduct = () => {
    if (Object.keys(this.state.product).length < 1) {
      return <EmptyView type={6} action={this.emptyAction} />;
    }
    return (
      <View style={{ flex: 1 }}>
        {this.renderProductDetail()}
      </View>
    );
  };

  render() {
    return this.state.isConnection == false
      ? this.renderNoInternetView()
      : this.state.isLoading
      ? this.renderSpinner()
      : <StoreProduct product={this.state.product} navigation={this.props.navigation}/>;
  }
}

const mapStateToProps = ({ cart }) => ({
  ...cart
})

const mapDispatchToProps = (dispatch) => ({
  addProductToCart: (form) => dispatch(CartActions.addProductToCart(form))
})
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
