import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { DEIBoldText, DEIMediumText } from './APIConstants';
import { Colors } from '../themes';

const SectionTitle = ({ title, onPress, data, showAll }) => (
  <View
    style={{
      marginTop: 13,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20
    }}
  >
    <DEIBoldText
      title={title.toUpperCase()}
      style={{ color: Colors.primary }}
    />
    {showAll && (
      <TouchableOpacity onPress={() => onPress(data)}>
        <DEIMediumText title={'View All'} style={{ color: Colors.accent }} />
      </TouchableOpacity>
    )}
  </View>
);

SectionTitle.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  data: PropTypes.any,
  showAll: PropTypes.bool
};

SectionTitle.defaultProps = {
  onPress: () => {},
  title: 'Section Title',
  data: {},
  showAll: true
};

export default SectionTitle;
