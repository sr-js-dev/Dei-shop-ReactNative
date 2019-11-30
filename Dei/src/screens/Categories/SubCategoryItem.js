import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import { LatoRegular } from '../../components';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';

const subcategoryiconSize = 47;

export class SubCategoryItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selected, category, index, isLeftCategory } = this.props;

    var bgColor = colors.white;
    if (isLeftCategory) {
      bgColor = selected
        ? colors.orangeCategorySelected
        : colors.orangeCategoryNormal;
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.action(category, index)}
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: bgColor
        }}
      >
        <ImageLoad
          style={{
            width: subcategoryiconSize,
            height: subcategoryiconSize,
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 0.5,
            overflow: 'hidden'
          }}
          isShowActivity={false}
          source={{ uri: category.image_url }}
          placeholderSource={require('../../assets/Home/ic_placeholderproduct_box.png')}
        />
        <LatoRegular
          title={category.name}
          style={{
            color: selected ? '#5A5A5A' : '#848484',
            fontSize: Fonts.size.verysmall,
            margin: 10,
            width: '60%'
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default SubCategoryItem;
