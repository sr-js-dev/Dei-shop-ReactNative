import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { STQuantityView } from '../components/STQuantityView';
import { DEIRegularText } from './APIConstants';
import { ApplicationStyles, Colors, Fonts } from '../themes';

class STCartGridItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item
    };
  }

  quantityChanged = () => {};

  detailAction = () => {
    this.props.action(this.state.item);
  };

  render() {
    const { product, price, grams, name, image_square_url, image_url } = this.props.item;
    var priceValue = 'S$' + parseFloat(price).toFixed(2);
    console.log(this.props.item);

    var storeName = '';
    if (this.props.item.store_name != null) {
      storeName = this.props.item.store_name;
    }

    const { titleStyle, gramsStyle, originalPriceStyle } = styles;
    return (
      <View
        style={{
          backgroundColor: '#fff',
          justifyContent: 'center',
          borderRadius: 20,
          ...ApplicationStyles.shadow.normal
        }}
      >
        <View style={{ margin: 10 }}>
          <TouchableOpacity onPress={() => this.props.action(this.state.item)}>
            <Image
              source={{ uri: image_square_url }}
              style={{ width: '90%', height: 80, resizeMode: 'contain' }}
            />
            <Text
              style={{
                color: Colors.black,
                fontSize: 12,
                marginTop: 5,
                textAlign: 'center',
                fontFamily: Fonts.type.medium,
                maxHeight: 50
              }}
              numberOfLines={3}
            >
              {name}
            </Text>
            <DEIRegularText
              title="Fair price"
              numberOfLines={1}
              style={{
                color: Colors.darkerGrey,
                textAlign: 'center',
                fontFamily: Fonts.type.base,
                fontSize: 10,
                minHeight: 30,
                marginTop: 10
              }}
            />
            <DEIRegularText title={priceValue} style={originalPriceStyle} />
          </TouchableOpacity>
          <STQuantityView
            item={this.props.item}
            quantityChanged={this.quantityChanged}
            isDetail={false}
            action={this.detailAction}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 11
  },
  gramsStyle: {
    fontSize: 10,
    color: '#424242',
    marginTop: 4,
    textAlign: 'left'
  },
  originalPriceStyle: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Fonts.type.base
  },
  newPriceStyle: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  }
});

export { STCartGridItem };
