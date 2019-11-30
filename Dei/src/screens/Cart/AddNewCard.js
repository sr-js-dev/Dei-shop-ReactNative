import React, { Component } from 'react';
import { View, TextInput, ImageBackground } from 'react-native';
import { DEIRegularText, DEIMediumText } from '../../components';
import { CreditCardInput } from 'react-native-credit-card-input';
import { CartButton } from './../../components/CartButton';
import Stripe from 'react-native-stripe-api';
import Spinner from 'react-native-loading-spinner-overlay';
import { isNetworkConnected, AXIOS_CONFIG } from './../../components/index';
import Axios from 'axios';
import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';

import Omise from 'omise-react-native';

// const apiKey = 'pk_live_s2M66GtYE9vvOoFdxJvCHnRH00G8VuSW88'; //'pk_test_jK9FADjhQj5Qm4eKzTDlFbwE00VgXdrfcj'; //'pk_test_inGvk34bnNRnIdcVroel7Fbq';
// const client = new Stripe(apiKey);

class AddNewCard extends Component {
  static navigationOptions = {
    title: 'ADD NEW CARD'
  };

  constructor(props) {
    super(props);

    Omise.config('pkey_test_5g5dyttgllkyiho95ud');

    this.state = {
      cardData: {},
      isLoading: false,
      name: ''
    };
  }

  _onChange = formData => {
    console.log(JSON.stringify(formData, null, ' '));
    this.setState({ cardData: formData });
  };
  _onFocus = field => console.log('focusing', field);

  async OmiseAddCard(formData) {
    console.log(formData);
    var values = formData.values;
    this.setState({ isLoading: true, name: values.name });
    var expiry = values.expiry;
    var array = expiry.split('/');

    const result = await Omise.createToken({
      card: {
        name: values.name,
        number: values.number,
        expiration_month: array[0],
        expiration_year: array[1],
        security_code: values.cvc
      }
    });

    console.log('data', result);

    if (result.card != null) {
      //var resDict = result;
      ///  resDict.card.exp_year = Number(array[1]);
      this.saveCardAPI(result);
    } else {
      var message = 'Unable to add Card - please try again later';
      const error = result.error;
      if (error != null) {
        message = error.message;
      }
      this.setState({ isLoading: false });

      setTimeout(() => {
        alert(message);
      }, 300);
    }
  }

  saveClicked = () => {
    var formData = this.state.cardData;
    if (Object.keys(formData).length === 0) {
      alert('enter card details');
    } else {
      if (formData.valid == true) {
        this.OmiseAddCard(formData);
      }
    }
  };

  saveCardAPI = res => {
    const { params } = this.props.navigation.state;
    isNetworkConnected().then(isConnected => {
      const card = res.card;
      if (isConnected) {
        // "card_token": "string",
        // "customer_token": "string",
        // "brand": "string",
        // "country": "string",
        // "description": "string",
        // "exp_month": 0,
        // "exp_year": 0,
        // "last4": "string"

        var parameters = {
          card_token: card.id,
          brand: card.brand,
          country: card.country,
          description: this.state.name,
          exp_month: card.expiration_month,
          exp_year: card.expiration_year,
          last4: card.last_digits,
          customer_token: res.id
        };
        console.log(parameters);
        var header = AppSessionManager.shared().getAuthorizationHeader();
        console.log(header);
        this.setState({ isLoading: true });
        Axios.post(API.AddCard, parameters, header)
          .then(res => {
            console.log(res);
            this.setState({ isLoading: false }, () => {
              this.props.navigation.goBack();
              params.refreshItem(res);
            });
          })
          .catch(err => {
            console.log(err.response);
            this.setState({ isLoading: false });
            var message = 'Unable to add Card - please try again later';
            if (err.response.data != null) {
              const error = err.response.data.error;
              if (error != null) {
                message = error.message;
              }
            }
            this.setState({ isLoading: false });

            setTimeout(() => {
              alert(message);
            }, 300);
          });
      }
    });
  };
  render() {
    return (
      <View style={{ marginTop: 15 }}>
        <Spinner visible={this.state.isLoading} />
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          onFocus={this._onFocus}
          onChange={this._onChange}
          cardImageFront={require('../../assets/Cart/ic_cardFront.png')}
          cardImageBack={require('../../assets/Cart/ic_cardBack.png')}
        />
        {/*<View style={{ height: 310 }}>
          <ImageBackground
            style={{
              width: '100%',
              height: 306,
              justifyContent: 'center'
            }}
            imageStyle={{ resizeMode: 'contain' }}
            source={require('../../assets/Cart/ic_card_new.png')}
          >
            <View style={{ marginHorizontal: 40 }}>
              <CardInputView
                title={'Card Number'}
                desc={'5264  6526  6552  3463'}
              />
              <CardInputView title={'Expiry'} desc={'05/24'} />
            </View>
          </ImageBackground>
        </View>*/}
        <View style={{ alignItems: 'center', margin: 20 }}>
          <CartButton title={'Save'} action={this.saveClicked} />
        </View>
      </View>
    );
  }
}

const CardInputView = ({ desc, title }) => {
  return (
    <View>
      <DEIMediumText title={title} style={{ color: '#fff', fontSize: 12 }} />
      <View>
        <TextInput
          placeholder={desc}
          placeholderTextColor={'#fff'}
          style={{ color: '#fff', fontSize: 16, marginTop: 5 }}
        />
        <View
          style={{
            height: 2,
            backgroundColor: '#fff',
            marginTop: 5
          }}
        />
      </View>
    </View>
  );
};
export default AddNewCard;
