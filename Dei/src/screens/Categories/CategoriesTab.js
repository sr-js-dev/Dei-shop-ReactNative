import React, { Component } from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet
} from 'react-native';
import { getCategoriesList, LatoRegular } from '../../components';
import ImageLoad from 'react-native-image-placeholder';
import { Fonts } from '../../themes';
import colors from '../../themes/Colors';
import SubCategoryItem from './SubCategoryItem';
import { connect } from 'react-redux'

const maincategoryIconSize = 62.0;
const subcategoryiconSize = 43;

export class CategoriesTab extends Component {
  static navigationOptions = {
    title: 'Categories'
  };

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedMainIndex: 0, // Top Categories
      selectedSubMainIndex: 0, // Left side category
      selectedSubIndex: 0, // Right side sub-Sub categories
      selectedMainCategory: {},
      selectedLeftCategoryList: [],
      selectedRightCategoryList: [],
      selectedSubCategoryName: '' // See All [Sub Category Name] in Right side header
    };
  }

  componentDidMount() {
    const { home } = this.props
    let items = home.categories
    if (Array.isArray(items) && items.length > 0) {
      this.updateSelectedMainCategory(items, 0);
    }
  }

  updateSelectedMainCategory(items, index = 0) {
    const firstMainCategory = items[index];
    var subCategoryFirstItems = [];
    var subRightFirstItems = [];
    var subCatname = '';

    // By Default - select first category
    if (Array.isArray(firstMainCategory.category)) {
      // Select First sub category from the main category
      subCategoryFirstItems = firstMainCategory.category;

      // select First category from the sub category first item
      if (Array.isArray(subCategoryFirstItems[0].category)) {
        subRightFirstItems = subCategoryFirstItems[0].category;
        subCatname = subCategoryFirstItems[0].name;
      }
    }

    this.setState({
      categories: items,
      selectedMainCategory: firstMainCategory,
      selectedLeftCategoryList: subCategoryFirstItems,
      selectedRightCategoryList: subRightFirstItems,
      selectedSubCategoryName: subCatname,
      selectedMainIndex: index,
      selectedSubMainIndex: 0,
      selectedSubIndex: 0
    });
  }

  mainCategoryClicked(index) {
    this.updateSelectedMainCategory(this.state.categories, index);
  }

  renderMainCategories() {
    const { selectedMainIndex } = this.state;
    return (
      <View style={{ backgroundColor: '#F1E3F1', height: 125 }}>
        <FlatList
          horizontal
          data={this.state.categories}
          extraDat={this.state}
          keyExtractor={(item, index) => `section_${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.mainCategoryClicked(index)}
              style={{
                marginHorizontal: 10,
                alignItems: 'center',
                marginVertical: 10
              }}
            >
              <ImageLoad
                style={{
                  width: maincategoryIconSize,
                  height: maincategoryIconSize,
                  borderRadius: maincategoryIconSize / 2,
                  borderColor: 'transparent',
                  borderWidth: 1,
                  overflow: 'hidden'
                }}
                isShowActivity={false}
                source={{ uri: item.image_url }}
                placeholderSource={require('../../assets/Home/ic_placeholderproduct_box.png')}
              >
                {index == selectedMainIndex && (
                  <Image
                    source={require('../../assets/Home/ic_cat_select.png')}
                    style={{
                      width: maincategoryIconSize,
                      height: maincategoryIconSize
                    }}
                  />
                )}
              </ImageLoad>
              <LatoRegular
                title={item.name}
                style={{
                  width: maincategoryIconSize,
                  textAlign: 'center',
                  color: '#5A5A5A',
                  fontSize: Fonts.size.verysmall,
                  marginTop: 7
                }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  subCategoriesListClicked = (item, index) => {
    this.setState({
      selectedSubMainIndex: index,
      selectedSubIndex: 0,
      selectedRightCategoryList: item.category,
      selectedSubCategoryName: item.name
    });
  };

  renderLeftSubCategories() {
    const { selectedSubMainIndex, selectedLeftCategoryList } = this.state;
    return (
      <View
        style={{
          width: '46%',
          backgroundColor: colors.orangeCategoryNormal
        }}
      >
        <FlatList
          data={selectedLeftCategoryList}
          extraData={this.state}
          renderItem={({ item, index }) => (
            <SubCategoryItem
              category={item}
              index={index}
              action={this.subCategoriesListClicked}
              selected={index == selectedSubMainIndex}
              isLeftCategory={true}
            />
          )}
        />
      </View>
    );
  }

  subRightCategoriesListClicked = (item, index) => {
    this.props.navigation.navigate('HomeCategorySearch', {
      category_id: item.id
    })
  };

  renderRightSubCategories() {
    const {
      selectedRightCategoryList,
      selectedSubCategoryName
    } = this.state;

    const { SeeAllRowStyle, SeeAllCategoryNameStyle, orangeLineStyle } = styles;

    return (
      <View style={{ width: '54%' }}>
        <View>
          <View style={SeeAllRowStyle}>
            <LatoRegular
              title={'See All '}
              style={{ fontSize: Fonts.size.verysmall, width: '23%' }}
            />
            <LatoRegular
              title={selectedSubCategoryName}
              style={SeeAllCategoryNameStyle}
            />
            <Image
              source={require('../../assets/Home/ic_cat_chevron.png')}
              style={{ width: 6, height: 12 }}
            />
          </View>
          <View style={orangeLineStyle} />
        </View>
        <FlatList
          data={selectedRightCategoryList}
          extraData={this.state}
          renderItem={({ item, index }) => (
            <SubCategoryItem
              category={item}
              index={index}
              action={this.subRightCategoriesListClicked}
              selected={false}
              isLeftCategory={false}
            />
          )}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderMainCategories()}
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {this.renderLeftSubCategories()}
          {this.renderRightSubCategories()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  SeeAllRowStyle: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  SeeAllCategoryNameStyle: {
    color: colors.orange,
    fontSize: Fonts.size.verysmall,
    width: '70%'
  },
  orangeLineStyle: {
    backgroundColor: colors.orange,
    height: 1,
    marginHorizontal: 10
  }
});

const mapStateToProps = ({ configuration }) => ({
  home: configuration.home
})
export default connect(mapStateToProps)(CategoriesTab);
