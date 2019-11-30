import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux'
import { ApplicationStyles } from '../themes';
import PropTypes from 'prop-types';

class CartBadge extends Component {
  state = {  }
  render() {
    const { cart } = this.props
    const badgeCount = cart && cart.products ? cart.products.length : 0
    if (badgeCount == 0) return null
    return (
      <View style={[ApplicationStyles.navigation.badgeContainer, this.props.style]}>
        <Text style={ApplicationStyles.navigation.badgeText}>
          {badgeCount}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = ({ cart }) => ({
  ...cart
})

CartBadge.propTypes = {
  style: PropTypes.any
}

export default connect(mapStateToProps)(CartBadge);