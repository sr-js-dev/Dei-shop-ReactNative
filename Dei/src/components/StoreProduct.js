import React, { Component } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import PropTypes from 'prop-types';
import { EmptyView } from './EmptyView';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../themes';
import { DEIBoldText, DEIRegularText, DEIMediumText } from './APIConstants';
import { Divider, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux'
import CartActions from '../redux/CartRedux'

class StoreProduct extends Component {
  state = {};

  openImagePreview = url => {
    this.props.navigation.navigate('ProductPreview', {
      url
    });
  };

  addProductToCart = () => {
    const { product, cart } = this.props
    this.props.addProductToCart({
      cart_id: cart.id,
      product_id: product.id,
      amount: 1,
      product_options: "string"
    })
  }
  render() {
    const { product } = this.props;
    if (!product) return <EmptyView type={6} action={() => {}} />;

    const {
      full_description,
      price,
      image_url,
      image_square_url,
      name,
      stock,
      code
    } = product;
    const regex = /(<([^>]+)>)/gi;
    var fullDescText = 'Available in 1Kg';
    if (full_description != null && full_description != '') {
      fullDescText = full_description;
    }
    const fullDesc = `${fullDescText}`.replace(regex, '');
    var priceValue = 'S$0';

    if (price != null) {
      priceValue = 'S$' + parseFloat(price).toFixed(2);
    }

    const imageUrl = image_url ? image_url : image_square_url;
    const { navigation } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <Touchable
              style={{ backgroundColor: Colors.grey }}
              onPress={() => this.openImagePreview(imageUrl)}
            >
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </Touchable>
            <View style={styles.nameContainer}>
              <DEIBoldText title={name} style={styles.name} />
              <DEIRegularText title={fullDesc} style={styles.description} />
              <DEIMediumText
                title={priceValue}
                style={styles.price}
              />
              <DEIRegularText title={"Relience Fresh"} style={styles.belowPrice} />
              <DEIRegularText title={"Code: " + code} style={styles.code} />
                <Text style={styles.availability}>Availability: <Text style={styles.inStock}>IN STOCK</Text></Text>
            </View>
            <Divider style={styles.divider}/>
            <View style={styles.productDescContainer}>
              <View style={styles.variantSectionContainer}>
                <DEIRegularText title={"Weight:"} style={styles.variantSectionTitle} />
                <Touchable style={styles.optionContainer}>
                  <>
                    <DEIRegularText title={"1 Kg"}/>
                    <Icon type='feather' name="chevron-down" color={Colors.primary}/>
                  </>
                </Touchable>
              </View>
              <View style={styles.variantSectionContainer}>
                <DEIRegularText title={"Variants:"} style={styles.variantSectionTitle} />
                <Touchable style={styles.optionContainer}>
                  <>
                    <DEIRegularText title={"10 pcs"}/>
                    <Icon type='feather' name="chevron-down" color={Colors.primary}/>
                  </>
                </Touchable>
              </View>
              <View style={styles.variantSectionContainer}>
                <DEIRegularText title={"Quantity:"} style={styles.variantSectionTitle} />
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                  <Touchable style={{height: 30, borderWidth: 1, borderColor: Colors.darkGrey, alignItems: 'center', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingHorizontal: 4}}>
                  <Icon type='feather' name="minus" color={Colors.darkerGrey}/>
                  </Touchable>
                  <View style={{height: 30, borderTopWidth: 1, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', width: 40, borderColor: Colors.darkGrey}}><DEIRegularText title="1"/></View>
                  <Touchable style={{height: 30, borderWidth: 1, borderColor: Colors.darkGrey, alignItems: 'center', borderTopRightRadius: 10, borderBottomRightRadius: 10, paddingHorizontal: 4}}>
                    <Icon type='feather' name="plus" color={Colors.accent}/>
                  </Touchable>
                  <DEIRegularText title={`${stock} pieces available`} style={{color: Colors.darkGrey, marginLeft: 10}}/>
                </View>
              </View>
            </View>
            <Divider style={styles.divider}/>
            <View style={styles.productDescContainer}>
              <DEIBoldText title={"Product Description"} style={{color: Colors.primary, fontSize: 20, marginBottom: 10}}/>
              <DEIBoldText title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempor posuere diam, nec condimentum lacus mollis sed." style={{marginBottom: 10, lineHeight: 20}}/>
              <DEIRegularText style={{lineHeight: 24, color: Colors.darkerGrey}} title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices, mi feugiat blandit dictum, urna dui pharetra mi, laoreet pretium magna magna sit amet purus. Maecenas fringilla nibh in mi sollicitudin, eu efficitur felis gravida. Curabitur eu tempus nulla. Etiam ipsum nisl, sollicitudin ac hendrerit vel, venenatis in sapien. Vivamus iaculis ex ante, at malesuada ante imperdiet et. Etiam hendrerit commodo nibh, vitae tincidunt justo mollis vel. Ut in porttitor nunc."/>
            </View>
            <Divider style={styles.divider}/>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <Touchable style={styles.button} onPress={this.addProductToCart}>
            <React.Fragment>
              <Image source={Images.cart.icon} style={ApplicationStyles.navigation.actionImage}/>
              <Text style={styles.buttonTitle} >Add to Cart</Text>
            </React.Fragment>
          </Touchable>
        </View>
      </View>
    );
  }
}

StoreProduct.propTypes = {
  product: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired
};

const mapStateToProps = ({ cart }) => ({
  ...cart
})

const mapDispatchToProps = (dispatch) => ({
  addProductToCart: (form) => dispatch(CartActions.addProductToCart(form))
})
export default connect(mapStateToProps, mapDispatchToProps)(StoreProduct);

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.white },
  image: { width: Metrics.screenWidth, height: 200, resizeMode: 'contain' },
  footer: { height: 100, backgroundColor: Colors.grey, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  nameContainer: {
    marginHorizontal: 20,
    marginTop: 30
  },
  name: { fontSize: 20, color: Colors.primary },
  description: { color: Colors.darkerGrey, marginTop: 5 },
  price: { fontSize: 25, color: Colors.accent, marginTop: 10, fontWeight: 'bold' },
  belowPrice: { color: Colors.green, fontFamily: Fonts.type.bold, marginTop: 10 },
  code: {marginTop: 10, color: Colors.darkerGrey},
  availability: {fontFamily: Fonts.type.base, marginTop: 10, color: Colors.darkerGrey},
  inStock: {color: Colors.green, fontWeight: 'bold'},
  divider: {marginVertical: 10},
  productDescContainer: {marginHorizontal: 20},
  button: { backgroundColor: Colors.accent, borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, marginLeft: 0},
  buttonTitle: {fontFamily: Fonts.type.bold, color: Colors.white, fontSize: 20},
  returnContainer: {
    padding: 15, backgroundColor: Colors.white, borderRadius: 15, borderWidth: 1, borderColor: Colors.darkGrey
  },
  variantSectionContainer: {flexDirection: 'row', alignItems: 'center', marginVertical: 10},
  variantSectionTitle: {width: 100},
  optionContainer: {flex: 1, padding: 5, paddingHorizontal: 15, borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  optionArrow: {}
});
