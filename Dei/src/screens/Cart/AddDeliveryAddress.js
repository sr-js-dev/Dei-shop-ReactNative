import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';

import { DEIRegularText, GradientModalBgView } from '../../components';
import { SgTextField, CartButton } from '../../components/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class AddDeliveryAddress extends Component {
  constructor(props) {
    super(props);
    if (
      this.props.address != null &&
      Object.keys(this.props.address).length > 0
    ) {
      console.log('33333333333', this.props);
      var address = this.props.address;
      this.state = {
        visible: this.props.visible,
        zipcode: address.postal_code,
        address: address["address-2"],
        firstname: address.firstname,
        lastname: address.lastname,
        contact: address.contact,
        building_name: address.building_name,
        building_type: address.building_type,
        lobby_name: address.lobby_name,
        street: address.street,
        floor: address.floor,
        unit: address.unit,
        contact: address.contact,
        isPrimaryAddr: false
      };
    } else {
      this.state = {
        visible: true,
        zipcode: '',
        address: '',
        firstname: '',
        lastname: '',
        contact: '',
        building_type: '',
        building_name: '',
        lobby_name: '',
        street: '',
        floor: '',
        unit: '',
        isPrimaryAddr: false
      };
    }

    // - firstname , lastname , address , city , zipcode,phone
    // this.state = {
    //   visible: this.props.visible,
    //   zipcode: '219924',
    //   address: '3 Belilios Rd,',
    //   firstname: 'Max',
    //   lastname: 'Kevin',
    //   mobileno: '+65 6491 0500',
    //   isPrimaryAddr: false
    // };
  }

  togglePrimaryAddress = () => {
    this.setState({
      isPrimaryAddr: !this.state.isPrimaryAddr
    });
  };

  textChanged = (text, placeholder) => {
    if (placeholder == 'First Name*') {
      this.setState({ firstname: text });
    } else if (placeholder == 'Last Name') {
      this.setState({ lastname: text });
    } else if (placeholder == 'Address*') {
      this.setState({ address: text });
    } else if (placeholder == 'Zip Code*') {
      this.setState({ zipcode: text });
    } else if (placeholder == 'Contact') {
      this.setState({ contact: text });
    } else if (placeholder == 'Building Type') {
      this.setState({ building_type: text });
    } else if (placeholder == 'Building Name') {
      this.setState({ building_name: text });
    } else if (placeholder == 'Street') {
      this.setState({ street: text });
    } else if (placeholder == 'Floor') {
      this.setState({ floor: text });
    } else if (placeholder == 'Unit') {
      this.setState({ unit: text });
    } else if (placeholder == 'Lobby Name') {
      this.setState({ lobby_name: text });
    }
    
    console.log(text);
  };

  saveClicked = () => {
    const { firstname, lastname, address, zipcode, mobileno,contact, building_type, building_name, lobby_name, street, floor, unit } = this.state;
    if (firstname.length < 1) {
      alert('Please enter First Name');
      return;
    } else if (address.length < 1) {
      alert('Please enter Address');
      return;
    } else if (zipcode.length < 1) {
      alert('Please enter Zip Code');
      return;
    } else if (contact.length < 1) {
      alert('Please enter Contact');
      return;
    }else if (building_type.length < 1) {
      alert('Please enter Building Type');
      return;
    }else if (building_name.length < 1) {
      alert('Please enter Building Name');
      return;
    }else if (lobby_name.length < 1) {
      alert('Please enter Lobby Name');
      return;
    }else if (street.length < 1) {
      alert('Please enter Street');
      return;
    }else if (floor.length < 1) {
      alert('Please enter Floor');
      return;
    }else if (unit.length < 1) {
      alert('Please enter Unit');
      return;
    }

    //  name, address, city, mobile, primary

    //   "profile_name": "string",
    // "firstname": "string",
    // "lastname": "string",
    // "address": "string",
    // "address-2": "string",
    // "city": "string",
    // "county": "string",
    // "state": "string",
    // "state_descr": "string",
    // "country": "string",
    // "country_descr": "string",
    // "zipcode": "string",
    // "phone": "string"

    var name = firstname + ' ' + lastname;
    const details = {
      firstname: firstname,
      lastname: lastname,
      address: address,
      'address-2': address,
      city: 'Singapore',
      country: 'SG',
      country_descr: 'SG',
      state: 'Singapore',
      state_descr: 'Singapore',
      county: 'SG',
      zipcode: zipcode,
      profile_name: name,
      contact:contact,
      building_type:building_type,
      building_name:building_name,
      lobby_name:lobby_name,
      street:street,
      floor:floor,
      unit:unit,
      is_default:0
    };
    this.props.action(details);
  };

  closeModal = () => {
    this.setState({ visible: false });
    this.props.closeModal();
  };

  render() {
    const { gradBgStyle, viewContainerStyle } = styles;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.visible}
      >
        <View>
          <GradientModalBgView onPress={this.closeModal}>
            <View style={viewContainerStyle}>
              <KeyboardAwareScrollView>
                <DEIRegularText
                  title={'Enter your delivery address'}
                  style={{
                    textAlign: 'center',
                    color: '#B19CFD',
                    marginTop: 10
                  }}
                />
                <View style={{ justifyContent: 'center', marginTop: 30 }}>
                  <SgTextField
                    placeholder={'First Name*'}
                    action={this.textChanged}
                    value={this.state.firstname}
                  />
                  <SgTextField
                    placeholder={'Last Name'}
                    action={this.textChanged}
                    value={this.state.lastname}
                  />
                  <SgTextField
                    placeholder={'Contact'}
                    action={this.textChanged}
                    value={this.state.contact}
                  />
                  <SgTextField
                    placeholder={'Building Type'}
                    action={this.textChanged}
                    value={this.state.building_type}
                  />
                  <SgTextField
                    placeholder={'Building Name'}
                    action={this.textChanged}
                    value={this.state.building_name}
                  />
                  <SgTextField
                    placeholder={'Lobby Name'}
                    action={this.textChanged}
                    value={this.state.lobby_name}
                  />
                  <SgTextField
                    placeholder={'Street'}
                    action={this.textChanged}
                    value={this.state.street}
                  />
                  <SgTextField
                    placeholder={'Floor'}
                    action={this.textChanged}
                    value={this.state.floor}
                  />
                  <SgTextField
                    placeholder={'Unit'}
                    action={this.textChanged}
                    value={this.state.unit}
                  />
                  <SgTextField
                    placeholder={'Address*'}
                    action={this.textChanged}
                    value={this.state.address}
                  />
                  <SgTextField
                    placeholder={'Zip Code*'}
                    action={this.textChanged}
                    value={this.state.zipcode}
                    sgKeyboardType={'number-pad'}
                  />
                </View>
                <View style={{ marginHorizontal: 20 }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                    onPress={this.togglePrimaryAddress}
                  >
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        marginHorizontal: 10,
                        backgroundColor: this.state.isPrimaryAddr
                          ? '#8CA2F8'
                          : '#F4F4F4'
                      }}
                    />
                    <DEIRegularText
                      title={'Set as primary delivery address'}
                      style={{ fontSize: 11 }}
                    />
                  </TouchableOpacity>
                  <CartButton
                    title={'Save'}
                    action={() => this.saveClicked()}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
          </GradientModalBgView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  gradBgStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewContainerStyle: {
    width: '80%',
    height: Platform.OS == 'ios' ? '50%' : '65%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff'
  }
});

export default AddDeliveryAddress;
