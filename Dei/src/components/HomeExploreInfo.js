import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Fonts, Images } from '../themes';
import { StorageKeys } from '../config';
import _ from 'lodash';

class HomeExploreInfo extends Component {
  state = {
    experience: {
      explore_name: 'Little India',
      experience_name: 'Retail'
    }
  };

  componentDidMount() {
    this.searchExperience();
  }

  searchExperience = async () => {
    const { experience_id } = this.props;
    let experiences = await AsyncStorage.getItem(StorageKeys.Experiences);
    experiences = JSON.parse(experiences);

    experiences.map(item => {
      if (item.experience_id == experience_id) {
        this.setState({ experience: item });
      }
    });
  };
  render() {
    const { experience } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <Image source={Images.home.explore} style={styles.exploreIcon} />
          <Text style={styles.title}>{experience.explore_name}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.item}>
          <Image source={Images.home.experience} style={styles.exploreIcon} />
          <Text style={styles.title}>{experience.experience_name}</Text>
        </View>
      </View>
    );
  }
}

HomeExploreInfo.propTypes = {
  experience_id: PropTypes.number.isRequired
};
export default HomeExploreInfo;

const styles = StyleSheet.create({
  exploreIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderColor: Colors.headerTint
  },
  verticalDivider: {
    width: 1,
    borderWidth: 1,
    borderColor: Colors.headerTint
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: Colors.headerTint,
    fontFamily: Fonts.type.base
  }
});
