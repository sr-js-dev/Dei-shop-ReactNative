import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import ImageLoad from 'react-native-image-placeholder';
import PropTypes from 'prop-types';
import { DEIMediumText } from './APIConstants';
import { ApplicationStyles, Colors } from '../themes';

const RoundedImageWithTitle = ({ onPress, data, imageUrl, title }) => (
  <Touchable onPress={() => onPress(data)}>
    <View style={styles.itemContainer}>
      <View style={styles.logoContainer}>
        {imageUrl != null && imageUrl !== '' ? (
          <ImageLoad
            borderRadius={15}
            style={styles.logo}
            resizeMode="contain"
            customImagePlaceholderDefaultStyle={styles.logo}
            source={{ uri: imageUrl }}
            placeholderSource={require('../assets/Home/ic_placeholderproduct_box.png')}
            isShowActivity={true}
            backgroundColor={'#E6E7E8'}
          />
        ) : (
          <Image
            source={require('../assets/Home/ic_placeholderproduct_box.png')}
            style={styles.logo}
          />
        )}
      </View>
      <DEIMediumText title={title} style={styles.title} />
    </View>
  </Touchable>
);

RoundedImageWithTitle.propTypes = {
  onPress: PropTypes.func,
  data: PropTypes.any,
  imageUrl: PropTypes.string,
  title: PropTypes.string
};

export default RoundedImageWithTitle;

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
  title: {
    color: Colors.black,
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 12
  }
});
