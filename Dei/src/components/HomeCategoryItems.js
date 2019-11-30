import React, { Component } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { DEIBoldText, DEIMediumText } from './APIConstants';
import ImageLoad from 'react-native-image-placeholder';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';

export class HomeCategoryItems extends Component {
  itemClicked(category) {
    this.props.onClick(category);
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        {this.props.items.map((category, index) => {
          return (
            <Touchable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10
              }}
              key={`home_category_${index}`}
              onPress={() => this.itemClicked(category)}
            >
              <React.Fragment>
                {category.image_url != null ? (
                  <ImageLoad
                    key={index}
                    style={{
                      width: 45,
                      height: 45,
                      resizeMode: 'contain'
                    }}
                    customImagePlaceholderDefaultStyle={{
                      width: 45,
                      height: 45,
                      resizeMode: 'contain'
                    }}
                    source={{ uri: category.image_url }}
                    placeholderSource={require('../assets/Home/ic_placeholderproduct_box.png')}
                    isShowActivity={true}
                    backgroundColor={'#E6E7E8'}
                  />
                ) : (
                  <Image
                    source={require('../assets/Home/ic_placeholderproduct_box.png')}
                    style={{
                      width: 45,
                      height: 45,
                      resizeMode: 'contain'
                    }}
                  />
                )}
                <DEIMediumText
                  title={category.name}
                  style={{
                    width: 50,
                    color: '#000',
                    marginVertical: 20,
                    textAlign: 'center',
                    fontSize: 12
                  }}
                />
              </React.Fragment>
            </Touchable>
          );
        })}
      </View>
    );
  }
}

HomeCategoryItems.propTypes = {
  items: PropTypes.array,
  onClick: PropTypes.func
};

HomeCategoryItems.defaultProps = {
  items: [],
  onClick: item => {}
};

export default HomeCategoryItems;
