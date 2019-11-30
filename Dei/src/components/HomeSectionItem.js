import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, View, StyleSheet, ImageBackground } from 'react-native';
import Grid from './EasyGrid';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { STCartGridItem } from './STCartGridItem';
import { DEIMediumText, DEIBoldText } from './APIConstants';
import ImageLoad from 'react-native-image-placeholder';
import Touchable from 'react-native-platform-touchable';
import { Colors, ApplicationStyles } from '../themes';
import RoundedImageWithTitle from './RoundedImageWithTitle';
import SectionTitle from './SectionTitle';

export class HomeSectionItem extends Component {
  productItemClicked = item => {
    this.props.homeNavigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };

  bannerClicked = item => {
    this.props.urlClicked(item);
  };

  renderTitleandViewAll(item) {
    return (
      <SectionTitle
        data={item}
        onPress={item => alert('view all pressed')}
        showAll={!(item.object_id == 0 && item.object_url == '')}
        title={item.name}
      />
    );
  }

  renderBannerImage(bannerUrl) {
    return (
      <View style={styles.bannerViewStyle}>
        <TouchableOpacity onPress={() => this.bannerClicked(this.state.item)}>
          <ImageLoad
            style={{ height: 108, width: '100%' }}
            source={{ uri: bannerUrl }}
            placeholderSource={require('../assets/Home/ic_placeholder_banner.png')}
            isShowActivity={false}
            backgroundColor={'#fff'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderItem = ({ item, index }) => {
    const { homeNavigation } = this.props;
    return (
      <RoundedImageWithTitle
        onPress={item =>
          homeNavigation.navigate('StoreDetail', { Store: item })
        }
        data={item}
        title={item.name}
        imageUrl={item.logo_url}
      />
    );
  };

  render() {
    const { item, index } = this.props;

    if (item === null) return null;

    const { banner_url, merchants } = item;
    return (
      <View>
        {banner_url.length < 1
          ? this.renderTitleandViewAll(item)
          : this.renderBannerImage(banner_url)}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 10
          }}
          data={merchants}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const maxItemWidth = 80;
const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 10,
    marginLeft: 10,
    width: maxItemWidth
  },
  logoContainer: {
    ...ApplicationStyles.shadow.normal,
    borderRadius: 15,
    backgroundColor: Colors.white
  },
  logo: {
    width: maxItemWidth,
    height: maxItemWidth,
    resizeMode: 'contain',
    borderRadius: 15
  },
  merchantName: {
    color: '#000',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 12
  },
  bannerViewStyle: {
    marginHorizontal: 12,
    resizeMode: 'contain',
    borderRadius: 15,
    overflow: 'hidden'
  }
});

HomeSectionItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.any
};

HomeSectionItem.defaultProps = {
  index: 0,
  item: null
};

export default HomeSectionItem;
