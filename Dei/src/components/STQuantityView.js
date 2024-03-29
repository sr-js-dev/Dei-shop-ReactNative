import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';

import AppSessionManager from './AppSessionManager';
import { Colors, Fonts } from '../themes';

const scrWidth = Dimensions.get('screen').width;
const QuantityWidth = scrWidth / 3 - 25;

const QButton = ({ title, action, color }) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={{
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: '#E9E9E9'
      }}
    >
      <Text style={{ textAlign: 'center', color: color, fontWeight: 'bold' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

class STQuantityView extends Component {
  constructor(props) {
    super(props);
    var currentQuantity = 0;
    if (props.item != null && props.item.quantity > 0) {
      currentQuantity = props.item.quantity;
    }
    var isHaveOptions = false;
    if (Array.isArray(props.item.options) && props.item.options.length > 0) {
      isHaveOptions = true;
    }
    console.log(props.isVarientSelected);
    this.state = {
      quantity: currentQuantity,
      item: props.item,
      hasOptions: isHaveOptions,
      hasVarients: props.isVarientSelected
    };

    this.addClicked = this.addClicked.bind(this);
    this.plusQuantityClicked = this.plusQuantityClicked.bind(this);
    this.minusQuantityClicked = this.minusQuantityClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.quantity != this.props.quantity) {
      this.setState({
        quantity: nextProps.item.quantity,
        item: nextProps.item
      });
    } else if (nextProps.isVarientSelected != this.props.isVarientSelected) {
      this.setState({
        hasVarients: nextProps.isVarientSelected
      });
    }
  }

  addClicked() {
    //debugger;
    if (this.state.hasOptions && !this.props.isDetail) {
      this.props.action();
      return;
    }

    // if (this.state.hasOptions && !this.props.isDetail) {
    //   this.props.action();
    //   return;
    // } else if (this.props.isDetail && !this.state.hasVarients) {
    //   alert('Please choose varient');
    //   return;
    // }

    var productInfo = this.state.item;
    this.setState({
      quantity: 1
    });

    productInfo.quantity = 1;
    productInfo.orderIndex = AppSessionManager.shared().getOrders().length + 1;
    AppSessionManager.shared().addItemToCart(productInfo);
    if (this.props.isfromCart == true) {
      AppSessionManager.shared().isCartChanged = true;
      AppSessionManager.shared().isHomeChanged = true;
    }
    console.log(AppSessionManager.shared().getOrders());
  }

  plusQuantityClicked() {
    const quantity = this.state.quantity;
    this.setState({
      quantity: quantity + 1
    });

    var productInfo = this.state.item;
    productInfo.quantity = quantity + 1;

    AppSessionManager.shared().addItemToCart(productInfo);
    if (this.props.isfromCart == true) {
      AppSessionManager.shared().isCartChanged = true;
      AppSessionManager.shared().isHomeChanged = true;
    }
    this.props.quantityChanged();
  }

  quantityClicked = isAdd => {
    var currentQuantity = this.state.quantity;
    if (isAdd) {
      currentQuantity += 1;
    } else {
      currentQuantity -= 1;
    }
    this.setState({
      quantity: currentQuantity
    });
    var productInfo = this.state.item;
    productInfo.quantity = currentQuantity;
    AppSessionManager.shared().addItemToCart(productInfo);
    if (this.props.isfromCart == true) {
      AppSessionManager.shared().isCartChanged = true;
      AppSessionManager.shared().isHomeChanged = true;
    }
    this.props.quantityChanged();
  };

  minusQuantityClicked() {
    var quantity = this.state.quantity - 1;
    this.setState({
      quantity: quantity
    });

    var productInfo = this.state.item;
    productInfo.quantity = quantity;

    AppSessionManager.shared().addItemToCart(productInfo);
    if (this.props.isfromCart == true) {
      AppSessionManager.shared().isCartChanged = true;
      AppSessionManager.shared().isHomeChanged = true;
    }
    this.props.quantityChanged();
  }

  renderQuantityAddedView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: QuantityWidth,
          justifyContent: 'space-evenly',
          paddingHorizontal: 10
        }}
      >
        <QButton
          title={'-'}
          action={() => this.quantityClicked(false)}
          color={Colors.primary}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
            fontFamily: Fonts.type.base
          }}
        >
          {this.state.quantity}
        </Text>
        <QButton
          title={'+'}
          action={() => this.quantityClicked(true)}
          color={Colors.primary}
        />
      </View>
    );
  };

  renderAddButton = () => {
    var marginValue = this.props.isDetail || !this.state.hasOptions ? 10 : 0;
    return (
      <TouchableOpacity
        onPress={this.addClicked}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            color: Colors.white,
            fontWeight: 'bold',
            fontFamily: Fonts.type.base,
            marginLeft: marginValue
          }}
        >
          {this.state.hasOptions && !this.props.isDetail ? 'OPTIONS' : 'ADD'}
        </Text>
        {(this.props.isDetail || !this.state.hasOptions) && (
          <QButton title={'+'} action={this.addClicked} color={'#E9E9E9'} />
        )}
      </TouchableOpacity>
    );
  };

  render() {
    var showAddButton =
      this.state.quantity == 0 ||
      (this.state.hasOptions && !this.props.isDetail);
    const backgroundColor =
      this.state.quantity == 0 ? Colors.accent : Colors.primary;
    return (
      <View
        style={{
          height: 30,
          width: QuantityWidth,
          justifyContent: 'center',
          borderRadius: 15,
          backgroundColor: backgroundColor
        }}
      >
        {showAddButton
          ? this.renderAddButton()
          : this.renderQuantityAddedView()}
      </View>
    );
  }
}

export { STQuantityView };
